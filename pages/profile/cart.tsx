import useSWR from "swr";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import CartItem from "@components/cart-item";

interface CartInfo {
  id: number;
  count: number;
  product: Product;
  productId: number;
}

interface CartResponse {
  ok: boolean;
  cartlist: CartInfo[];
}

interface CartProps {
  session: Session;
}

const Wishlist: NextPage = ({ session }: CartProps) => {
  const router = useRouter();
  console.log(session?.user?.cartlist?.length);

  const { data, mutate } = useSWR<CartResponse>("/api/users/cartlist");

  const setMutateData = (
    type: "increase" | "decrease" | "delete",
    cartId: number
  ) => {
    if (!data?.ok) return;
    switch (type) {
      case "increase":
        mutate(
          {
            ...data,
            cartlist: data.cartlist?.map((cart) =>
              cart.id === cartId ? { ...cart, count: cart.count + 1 } : cart
            ),
          },
          false
        );
        break;
      case "decrease":
        mutate(
          {
            ...data,
            cartlist: data.cartlist?.map((cart) =>
              cart.id === cartId ? { ...cart, count: cart.count - 1 } : cart
            ),
          },
          false
        );
        break;
      case "delete":
        mutate(
          {
            ...data,
            cartlist: data.cartlist?.filter((cart) => cart.id !== cartId),
          },
          false
        );
        break;
    }
  };

  return (
    <Layout user={session?.user}>
      <div className="flex flex-col items-center justify-center w-full px-10 min-w-[450px]">
        <h1 className="text-xl font-semibold sm:text-3xl">{"장바구니"}</h1>

        {!data?.ok ? (
          <>{"Loading..."}</>
        ) : data.cartlist.length > 0 ? (
          <div className="w-full mt-10 mb-14 flex flex-col gap-10">
            {data.cartlist.map(({ id, count, product, productId }) => (
              <CartItem
                id={id}
                productId={productId}
                key={productId}
                name={product.name}
                price={product.price}
                category={product.category}
                image={product.image}
                count={count}
                setMutateData={setMutateData}
              />
            ))}
          </div>
        ) : (
          <>
            <p className="mt-20 mb-6">장바구니가 비어있습니다.</p>
            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
            >
              장바구니 채우러 가기
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default Wishlist;
