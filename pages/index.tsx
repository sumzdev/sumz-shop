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
interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

interface HomeProps {
  session: Session;
}

function Home({ session }: HomeProps) {
  const router = useRouter();
  const { pathname, query, asPath } = router;

  // const { data: productRes } = useSWR<ProductsResponse>("/api/products");
  const { data: productRes } = useSWR<ProductsResponse>(
    asPath.replace("/", "/api/products")
  );

  const removeFilter = useCallback(
    (type: "category" | "price" | "keyword") => {
      const queryArr = Object.keys(query)
        .filter((key) => key !== "object Object")
        .map((key) => [key, query[key].toString()]);

      const params = new URLSearchParams(queryArr);

      if (type === "price") {
        params.delete("priceMin");
        params.delete("priceMax");
      } else {
        params.delete(type);
      }

      router.replace({ pathname, query: params.toString() }, undefined);
    },
    [pathname, query, router]
  );

  const search = useCallback(
    (
      key: "category" | "price" | "keyword",
      value?: string,
      priceMinMax?: [string | number, string | number]
    ) => {
      if (key === "price" && priceMinMax) {
        const [priceMin, priceMax] = priceMinMax;
        router.query.priceMin = priceMin.toString();
        router.query.priceMax = priceMax.toString();
      } else {
        router.query[key] = value;
      }
      router.push(router);
    },
    [router]
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
        <div className="mt-10 my-20 grid gap-10 lg:grid-cols-3">
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
