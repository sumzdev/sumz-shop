import useSWR from "swr";
import Layout from "@components/layout";
import { Product, Role } from "@prisma/client";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { getSession, useSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import Search from "@components/search";
import { useCallback } from "react";
interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

export interface SearchFilter {
  keyword: string;
  category: string;
  priceMin: number;
  priceMax: number;
}

function Home() {
  const { data: userData, status } = useSession();

  const [filter, setFilter] = useState<SearchFilter>({
    keyword: "",
    category: "",
    priceMin: 0,
    priceMax: 0,
  });

  console.log(filter);

  const searchFilterPrice = useCallback(
    (priceMin: number, priceMax: number) => {
      setFilter({ ...filter, priceMin, priceMax });

      // TODO: set chip
      // TODO: products api
    },
    [filter]
  );

  const searchFilterKeyword = useCallback(
    (keyword: string) => {
      setFilter({ ...filter, keyword });

      // TODO: set chip
      // TODO: products api
    },
    [filter]
  );

  const searchFilterCategory = useCallback(
    (category: string) => {
      setFilter({ ...filter, category });

      // TODO: set chip
      // TODO: products api
    },
    [filter]
  );

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  useEffect(() => {
    console.log("status", status);
  }, [status]);

  const { data } = useSWR<ProductsResponse>("/api/products");
  if (!data || status === "loading") {
    return <ProductsLoad />;
  }

  return (
    <Layout
      admin={userData?.user?.email === Role.ADMIN}
      login={status === "authenticated"}
    >
      <Search
        searchPrice={searchFilterPrice}
        searchCategory={searchFilterCategory}
        searchKeyword={searchFilterKeyword}
      />

      <div className="flex flex-col items-center justify-center w-full px-10">
        <div className="mt-10 my-20 grid gap-10 lg:grid-cols-3">
          {data.products?.map((product: Product) => (
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

      {userData?.user?.role === Role.ADMIN && (
        <FloatingButton href={`/products/upload`} text="상품 추가하기">
          <AddIcon />
        </FloatingButton>
      )}

      {userData?.user?.email}
      {userData?.user?.role === Role.ADMIN}
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default Home;
