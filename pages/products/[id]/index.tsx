import useSWR from "swr";
import { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import ProductDetailLoad from "@components/productDetailLoad";
import { Button, Container } from "@mui/material";
import { Product, Role } from "@prisma/client";
import { CATEGORY } from "constants/category";
import { getSession, useSession } from "next-auth/react";
import { rgbDataURL } from "@libs/client/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import FloatingButton from "@components/floating-button";
import { Session } from "next-auth";

interface ProductDetailResponse {
  ok: boolean;
  product: Product;
  isFavorited: boolean;
}

interface ProductDetailProps {
  session: Session;
}

const ProductDetail: NextPage = ({ session }: ProductDetailProps) => {
  const { user } = session;
  const admin = user?.role === Role.ADMIN;

  const router = useRouter();

  const { data } = useSWR<ProductDetailResponse>(
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
                <p className="text-lg mt-4">{CATEGORY[product?.category]}</p>
              )}
              <p className="text-xl text-gray-600 mt-3 text-right">
                {product?.price} 원
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-8">
              {/* 위시리스트 */}
              <Button variant="outlined" sx={{ py: 2 }}>
                {data?.isFavorited ? (
                  <FavoriteIcon className="text-pink-500" />
                ) : (
                  <FavoriteBorderIcon />
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

      {admin && (
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
