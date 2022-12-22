import useSWR from "swr";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import CartItem from "@components/cart-item";
import { priceToStr } from "@libs/client/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";

interface IFormInput {
  cartStatus: Record<number, boolean>;
}

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

  const [allCartCheckedStatus, setAllCartCheckedStatus] = useState<
    Record<number, boolean>
  >({});

  const { data, mutate } = useSWR<CartResponse>("/api/users/cartlist");

  const [orderCartlist, { loading: orderLoading, data: orderRes }] =
    useMutation("/api/users/order/cartlist");

  useEffect(() => {
    if (orderLoading || !orderRes?.ok) return;
    if (!data.cartlist || !orderRes.cartlist) return;

    if (orderRes && orderRes.ok) {
      const orderInfo = data.cartlist
        .filter((cart) => orderRes.cartlist.includes(cart.id.toString()))
        .reduce(
          (str, cart) => str + `${cart.product.name} [${cart.count}개]\n`,
          ""
        );

      alert("주문이 완료되었습니다.\n\n[주문상품]\n" + orderInfo);
      router.push("/");
    }
  }, [data, orderLoading, orderRes, router]);

  useEffect(() => {
    if (!data?.ok) return;

    setAllCartCheckedStatus(
      Object.fromEntries(data.cartlist.map((cartData) => [cartData.id, true]))
    );
  }, [data]);

  const toggleCheckOrder = (cartId: number) => {
    setAllCartCheckedStatus({
      ...allCartCheckedStatus,
      [cartId]: !allCartCheckedStatus[cartId],
    });
  };

  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: {
      cartStatus: allCartCheckedStatus,
    },
  });

  const totalPrice = data
    ? data?.cartlist.reduce(
        (acc, cartInfo) => acc + cartInfo.count * cartInfo.product.price,
        0
      )
    : 0;

  const onSubmitOrder: SubmitHandler<IFormInput> = useCallback(() => {
    if (!data.ok) return;
    if (orderLoading) return;

    const orderCartIdList = Object.keys(allCartCheckedStatus).filter(
      (cartId) => !!allCartCheckedStatus[cartId]
    );

    if (orderCartIdList.length === 0) {
      alert("주문할 상품을 선택해 주세요!");
      return;
    }

    orderCartlist({
      cartIdList: Object.keys(allCartCheckedStatus).filter(
        (cartId) => !!allCartCheckedStatus[cartId]
      ),
    });
  }, [data, orderLoading, allCartCheckedStatus, orderCartlist]);

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
          <form className="w-full" onSubmit={handleSubmit(onSubmitOrder)}>
            <div className="w-full mt-10 pb-[10rem] flex flex-col gap-10">
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
                  checked={allCartCheckedStatus[id]}
                  toggleCheck={() => toggleCheckOrder(id)}
                  setMutateData={setMutateData}
                />
              ))}
            </div>

            <div className="w-full border bg-gray-200 p-4 flex flex-row justify-between fixed left-0 bottom-0 h-[6rem] align-center">
              <p className="text-xl sm:text-2xl mb-4 mt-auto ml-5">{`총 주문 금액 : ${priceToStr(
                totalPrice
              )} 원`}</p>
              <Button variant="contained" sx={{ py: 1, px: 5 }} type="submit">
                <p className="text-md sm:text-lg">주문하기</p>
              </Button>
            </div>
          </form>
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
