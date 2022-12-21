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

interface ProductDetailResponse {
  ok: boolean;
  product: Product;
  isFavorited: boolean;
}

interface ProductDetailProps {
  session: Session;
}

interface ICartCount {
  count: number;
}

const ProductDetail: NextPage = ({ session }: ProductDetailProps) => {
  const router = useRouter();

  const isAdmin = session?.user?.role === Role.ADMIN;

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
    if (!!cartData?.ok) {
      alert("상품이 장바구니에 추가되었습니다!");
      resetField("count");
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

  if (!data) {
    return <ProductDetailLoad />;
  }

  if (data.ok && !data.product) {
    // TODO: 404
  }
  return (
    <Layout user={session?.user}>
      <Container className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col md:grid md:grid-cols-2 ">
          <div className="flex w-full mx-auto  items-center justify-center">
            <Image
              src={
                product?.image && product?.image !== ""
                  ? product?.image
                  : "https://via.placeholder.com/300"
              }
              alt={product?.name || "product image"}
              width={300}
              height={300}
              placeholder="blur"
              blurDataURL={rgbDataURL(100, 100, 100)}
              className="items-center w-fit overflow-hidden max-w-[300px] max-h-[300px]"
              unoptimized={process.env.NODE_ENV !== "production"}
            />
          </div>

          <div className="mt-10 md:mt-0 w-full h-full flex flex-col justify-between">
            <div>
              <h1 className="text-3xl">{product?.name}</h1>
              {product?.category && (
                <p className="text-lg mt-4">{CATEGORY[product?.category]}</p>
              )}
              <p className="text-xl text-gray-600 mt-3 text-right">
                {product?.price} 원
              </p>
            </div>

            <div className="flex flex-row mt-8">
              {/* 위시리스트 */}
              <Button
                // variant="outlined"
                sx={{ py: 2, borderColor: "lightgray" }}
                onClick={onFavClick}
              >
                {data?.isFavorited ? (
                  <FavoriteIcon fontSize="large" className="text-pink-500" />
                ) : (
                  <FavoriteBorderIcon fontSize="large" />
                )}
              </Button>

              <form
                className="w-full grid grid-cols-3 gap-4  p-4 rounded-md"
                onSubmit={handleSubmit(onCartClick)}
              >
                <Controller
                  name="count"
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^\d+$/,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      variant="outlined"
                      className="bg-white col-span-2"
                    />
                  )}
                />

                {/* 장바구니 */}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ py: 2 }}
                  fullWidth
                >
                  Cart
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="my-10">
          <p className="">{product?.description}</p>
        </div>
      </Container>

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

export default ProductDetail;
