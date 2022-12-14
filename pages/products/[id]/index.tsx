import useSWR from "swr";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import ProductDetailLoad from "@components/productDetailLoad";
import { Button, Container } from "@mui/material";
import { Product } from "@prisma/client";
import { Category } from "constants/category";
import { useSession } from "next-auth/react";
import { rgbDataURL } from "@libs/client/utils";

interface ProductDetailResponse {
  ok: boolean;
  product: Product;
  isFavorited: boolean;
}

const ProductDetail: NextPage = () => {
  const { data: user, status } = useSession();

  const router = useRouter();

  const { data, mutate } = useSWR<ProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  if (!data) {
    return <ProductDetailLoad />;
  }

  if (data.ok && !data.product) {
    // TODO: 404
  }

  const product = data?.product;

  const onFavFlick = () => {
    // TODO: fav
  };

  const onCartClick = () => {
    // TODO: cart
  };

  return (
    <Layout>
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
                <p className="text-lg mt-4">{Category[product?.category]}</p>
              )}
              <p className="text-xl text-gray-600 mt-3 text-right">
                {product?.price} 원
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-8">
              {/* 위시리스트 */}
              <Button variant="outlined" sx={{ py: 2 }}>
                {data?.isFavorited ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-pink-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </Button>

              {/* 장바구니 */}
              <Button variant="outlined" sx={{ py: 2 }}>
                Cart
              </Button>
            </div>
          </div>
        </div>

        <div className="my-10">
          <p className="">{product?.description}</p>
        </div>
      </Container>
    </Layout>
  );
};
export default ProductDetail;
