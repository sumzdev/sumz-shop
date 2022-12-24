import useSWR from "swr";
import Layout from "@components/layout";
import { Product, Role } from "@prisma/client";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { getSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { NextPageContext } from "next";
import Search from "@components/search";
import { useCallback } from "react";
import { Session } from "next-auth";
import Pagination from "@components/pagination";
import { getParams } from "@libs/client/utils";
import { Button } from "@mui/material";
import { ProductWithFav } from "types/product";
import Products from "@components/products";

interface ProductsResponse {
  ok: boolean;
  products: ProductWithFav[];
  count: number;
  maxPrice: number;
}

interface KeywordResponse {
  ok: boolean;
  keywords: string[];
}

interface HomeProps {
  session: Session;
}

function Home({ session }: HomeProps) {
  const isAdmin = session?.user?.role === Role.ADMIN;

  const router = useRouter();
  const { pathname, query, asPath } = router;

  const pageNum = query.pageIndex ? parseInt(query.pageIndex.toString()) : 1;
  if (!query.pageIndex) {
    query.pageIndex = pageNum.toString();
  }

  const params = getParams(query);

  const { data: productRes, mutate } = useSWR<ProductsResponse>(
    asPath.replace("/", "/api/products")
  );

  const toggleFavMutate = (productId: number) => {
    if (!productRes?.products) return;

    mutate(
      {
        ...productRes,
        products: productRes.products.map((product) =>
          product.id === productId
            ? { ...product, isFav: !product.isFav }
            : product
        ),
      },
      false
    );
  };

  const moveProductDetail = useCallback(
    (productId: number) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  const movePageIndex = useCallback(
    (pageIdx: number) => {
      query.pageIndex = pageIdx.toString();
      router.push(router);
    },
    [query, router]
  );

  const removeFilter = useCallback(
    (type: "category" | "price" | "keyword") => {
      if (type === "price") {
        params.delete("priceMin");
        params.delete("priceMax");
      } else {
        params.delete(type);
      }
      query.pageIndex = "1";
      router.replace({ pathname, query: params.toString() }, undefined);
    },
    [params, pathname, router, query]
  );

  const search = useCallback(
    (
      key: "category" | "price" | "keyword",
      value?: string,
      priceMinMax?: [string | number, string | number]
    ) => {
      if (key === "price" && priceMinMax) {
        const [priceMin, priceMax] = priceMinMax;
        query.priceMin = priceMin.toString();
        query.priceMax = priceMax.toString();
      } else {
        query[key] = value;
      }
      query.pageIndex = "1";
      router.push(router);
    },
    [query, router]
  );

  const { data: keywordRes } = useSWR<KeywordResponse>("/api/products/keyword");

  return (
    <Layout user={session?.user}>
      <Search
        search={search}
        removeFilter={removeFilter}
        productNames={keywordRes?.keywords || []}
        maxPrice={productRes?.maxPrice || 0}
      />

      {!productRes?.ok ? (
        <ProductsLoad />
      ) : (
        <Products
          pageNum={pageNum}
          count={productRes.count}
          productList={productRes.products}
          moveProductDetail={moveProductDetail}
          toggleFavMutate={toggleFavMutate}
          movePageIndex={movePageIndex}
        />
      )}

      {isAdmin && (
        <FloatingButton href={`/products/upload`} text="상품 추가하기">
          <AddIcon />
        </FloatingButton>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

export default Home;
