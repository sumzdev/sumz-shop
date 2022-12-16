import useSWR from "swr";
import Layout from "@components/layout";
import { Product, Role } from "@prisma/client";
import { Container } from "@mui/system";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { getSession, useSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPageContext } from "next";

interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

function Home() {
  const { data: userData, status } = useSession();

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
      <Container className="flex flex-col items-center justify-center w-full">
        <div className="border">상품 검색 필터</div>
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
      </Container>

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
