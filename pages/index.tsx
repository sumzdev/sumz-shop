import useSWR from "swr";
import Layout from "@components/layout";
import { Product, Role } from "@prisma/client";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { getSession, useSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { NextPageContext } from "next";
import Search from "@components/search";
import { useCallback } from "react";
import { Session } from "next-auth";
import products from "./api/products";
import Pagination from "@components/pagination";
import { getParams } from "@libs/client/utils";
import { Button } from "@mui/material";
interface ProductsResponse {
  ok: boolean;
  products: Product[];
  count: number;
}

interface HomeProps {
  session: Session;
}

function Home({ session }: HomeProps) {
  const router = useRouter();
  const { pathname, query, asPath } = router;

  const pageNum = query.pageIndex ? parseInt(query.pageIndex.toString()) : 1;
  if (!query.pageIndex) {
    query.pageIndex = pageNum.toString();
  }

  const params = getParams(query);

  const { data: productRes } = useSWR<ProductsResponse>(
    asPath.replace("/", "/api/products")
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

      router.replace({ pathname, query: params.toString() }, undefined);
    },
    [params, pathname, router]
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
      router.push(router);
    },
    [query, router]
  );

  const productNames = useMemo(
    () => productRes?.products.map((product) => product.name),
    [productRes?.products]
  );

  if (!productRes?.ok) {
    return <ProductsLoad />;
  }

  return (
    <Layout admin={session?.user?.role === Role.ADMIN} login={!!session?.user}>
      <Search
        search={search}
        removeFilter={removeFilter}
        productNames={productNames}
      />

      <div className="flex flex-col items-center justify-center w-full px-10">
        {!!productRes.count ? (
          <div className="w-full mt-10 mb-14 grid gap-10 lg:grid-cols-3">
            {productRes.products?.map((product: Product) => (
              <Item
                id={product.id}
                key={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                image={product.image}
              />
            ))}
          </div>
        ) : (
          <>
            <p className="mt-20 mb-6">찾으시는 결과가 없습니다.</p>
            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
            >
              전체 상품 보기
            </Button>
          </>
        )}
        <div className="w-full mb-20 ">
          <Pagination
            count={productRes?.count}
            pageIndex={pageNum}
            movePageIndex={movePageIndex}
          />
        </div>
      </div>

      {session?.user?.role === Role.ADMIN && (
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
