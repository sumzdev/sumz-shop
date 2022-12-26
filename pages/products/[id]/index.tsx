import useSWR from "swr";
import { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import ProductDetailLoad from "@components/productDetailLoad";
import { Button, Container, TextField } from "@mui/material";
import { Product, Role } from "@prisma/client";
import { CATEGORY } from "constants/category";
import { getSession } from "next-auth/react";
import { rgbDataURL } from "@libs/client/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import FloatingButton from "@components/floating-button";
import { Session } from "next-auth";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ProductWithFav } from "types/product";
import ProductDetail from "@components/productDetail";

interface ProductDetailResponse {
  ok: boolean;
  product: Product;
  isFavorited: boolean;
}

interface ProductDetailProps {
  session: Session;
}

export interface ICartCount {
  count: number;
}

const Product: NextPage = ({ session }: ProductDetailProps) => {
  const router = useRouter();

  const isAdmin = session ? session?.user?.role === Role.ADMIN : false;

  const { handleSubmit, resetField, control } = useForm<ICartCount>({
    defaultValues: { count: 1 },
  });

  const { data, mutate } = useSWR<ProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const product = data?.product;

  const [toggleFav] = useMutation(
    `/api/products/${router.query.id.toString()}/fav`
  );

  const [saveCart, { loading, data: cartData }] = useMutation(
    `/api/products/${router.query.id}/cart`
  );
  useEffect(() => {
    console.log(cartData?.ok);
    if (!!cartData?.ok) {
      alert("상품이 장바구니에 추가되었습니다!");
      // resetField("count");
    }
  }, [cartData?.ok, resetField]);

  const onFavClick = () => {
    toggleFav({});
    if (!data) return;
    mutate({ ...data, isFavorited: !data.isFavorited }, false);
  };

  const onCartClick = (cartInfo: ICartCount) => {
    if (!data?.ok) return;
    saveCart(cartInfo);
  };

  return (
    <Layout user={session?.user}>
      {data?.ok ? (
        !!data?.product ? (
          <form onSubmit={handleSubmit(onCartClick)}>
            <ProductDetail
              product={data?.product}
              isFav={data?.isFavorited}
              onFavClick={() => onFavClick()}
              control={control}
            />
          </form>
        ) : (
          <div>{"해당 상품이 존재하지 않습니다."}</div>
        )
      ) : (
        <ProductDetailLoad />
      )}

      {isAdmin && (
        <FloatingButton
          href={`/products/${router.query.id}/edit`}
          text="상품 수정하기"
        >
          <EditIcon />
        </FloatingButton>
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default Product;
