import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import ProductDetailLoad from "@components/productDetailLoad";
import { Button, Container, TextField } from "@mui/material";
import { CATEGORY } from "constants/category";
import { rgbDataURL } from "@libs/client/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { ICartCount } from "pages/products/[id]";
import { Product } from "@prisma/client";

interface ProductDetailProps {
  product: Product;
  isFav: boolean;
  onFavClick: () => void;
  handleSubmit: () => void;
  control: Control<ICartCount, any>;
}

export default function ProductDetail({
  isFav,
  product,
  onFavClick,
  handleSubmit,
  control,
}: ProductDetailProps) {
  console.log(product?.image);

  return (
    <Container className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:grid md:grid-cols-2 ">
        <div className="flex w-full mx-auto  items-center justify-center">
          <Image
            src={
              product?.image && product.image !== ""
                ? product.image
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
              {isFav ? (
                <FavoriteIcon fontSize="large" className="text-pink-500" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </Button>

            <form
              className="w-full grid grid-cols-3 gap-4  p-4 rounded-md"
              onSubmit={handleSubmit}
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
  );
}
