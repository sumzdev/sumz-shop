import useSWR from "swr";
import Item from "@components/item";
import Layout from "@components/layout";
import { Fav, Product } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import WishlistLoad from "@components/wisListhLoad";

interface FavInfo {
  id: number;
  product: Product;
  productId: number;
}

interface WishlistResponse {
  ok: boolean;
  wishlist: FavInfo[];
}

interface WishlistProps {
  session: Session;
}

const Wishlist: NextPage = ({ session }: WishlistProps) => {
  const router = useRouter();

  const { data, mutate } = useSWR<WishlistResponse>("/api/users/wishlist");

  const toggleFavMutate = (favId: number) => {
    if (!data) return;
    mutate(
      {
        ...data,
        wishlist: data.wishlist?.filter((fav) => fav.id !== favId),
      },
      false
    );
  };

  return (
    <Layout user={session?.user}>
      <div className="flex flex-col items-center justify-center w-full px-10">
        <h1 className="text-xl font-semibold sm:text-3xl">{"위시 리스트"}</h1>

        {!data?.ok ? (
          <WishlistLoad />
        ) : data.wishlist.length > 0 ? (
          <div className="w-full mt-10 mb-14 grid gap-10 lg:grid-cols-3">
            {data.wishlist.map(({ id: favId, product, productId }) => (
              <Item
                id={productId}
                key={productId}
                name={product.name}
                price={product.price}
                category={product.category}
                image={product.image}
                moveProduct={() => {
                  router.push(`/products/${product.id}`);
                }}
                isFav={true}
                toggleFavMutate={() => toggleFavMutate(favId)}
              />
            ))}
          </div>
        ) : (
          <>
            <p className="mt-20 mb-6">위시 상품이 없습니다.</p>
            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
            >
              위시 리스트 담으러 가기
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
