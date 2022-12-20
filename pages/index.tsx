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
import { Session } from "next-auth";
interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

export interface SearchFilter {
  keyword: string;
  category: string;
  priceMin: number | "";
  priceMax: number | "";
}

interface HomeProps {
  session: Session;
}

function Home({ session }: HomeProps) {
  const [filter, setFilter] = useState<SearchFilter>({
    keyword: "",
    category: "",
    priceMin: "",
    priceMax: "",
  });

  console.log(filter);

  const searchFilterPrice = useCallback(
    (priceMin: number | "", priceMax: number | "") => {
      setFilter({ ...filter, priceMin, priceMax });

      // TODO: products api
      console.log("update (price) products list");
    },
    [filter]
  );

  const searchFilterKeyword = useCallback(
    (keyword: string) => {
      setFilter({ ...filter, keyword });

      // TODO: products api
      console.log("update (keyword) products list");
    },
    [filter]
  );

  const searchFilterCategory = useCallback(
    (category: string) => {
      setFilter({ ...filter, category });

      // TODO: products api
      console.log("update (category) products list");
    },
    [filter]
  );

  const { data } = useSWR<ProductsResponse>("/api/products");
  if (!data) {
    return <ProductsLoad />;
  }
  const productNames = data ? data.products.map((product) => product.name) : [];

  return (
    <Layout admin={session?.user?.role === Role.ADMIN} login={!!session?.user}>
      <Search
        searchFilter={filter}
        searchPrice={searchFilterPrice}
        searchCategory={searchFilterCategory}
        searchKeyword={searchFilterKeyword}
        productNames={productNames}
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
    props: { session },
  };
}

export default Home;
