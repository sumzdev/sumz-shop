import useSWR from "swr";
import Layout from "@components/layout";
import { Cart, Fav, Product, Role } from "@prisma/client";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { getSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { NextPageContext } from "next";
import Search from "@components/search";
import { useCallback } from "react";
import { Session, User } from "next-auth";
import Pagination from "@components/pagination";
import { getParams } from "@libs/client/utils";
import { Button } from "@mui/material";
import { ProductWithFav } from "types/product";

interface ProductsResponse {
  ok: boolean;
  products: ProductWithFav[];
  count: number;
  maxPrice: number;
}

interface KeywordResponse {
  ok: boolean;
  keywords: string[];
}

interface ProductsProps {
  pageNum: number;
  count: number;
  productList: ProductWithFav[];
  moveProductDetail: (productId: number) => void;
  toggleFavMutate: (productId: number) => void;
  movePageIndex: (pageIdx: number) => void;
}

export default function Products({
  pageNum,
  count,
  productList,
  moveProductDetail,
  toggleFavMutate,
  movePageIndex,
}: ProductsProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full px-10">
      {count ? (
        <div className="w-full mt-10 mb-14 grid gap-10 lg:grid-cols-3">
          {productList?.map((product: ProductWithFav) => (
            <Item
              id={product.id}
              key={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              image={product.image}
              toggleFavMutate={() => toggleFavMutate(product.id)}
              moveProduct={() => {
                moveProductDetail(product.id);
              }}
              isFav={product.isFav}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="mt-20 mb-6">찾으시는 결과가 없습니다.</p>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/");
            }}
          >
            전체 상품 보기
          </Button>
        </>
      )}
      <div className="w-full mb-20 ">
        <Pagination
          count={count}
          pageIndex={pageNum}
          movePageIndex={movePageIndex}
        />
      </div>
    </div>
  );
}
