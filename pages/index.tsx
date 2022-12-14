import useSWR from "swr";
import Layout from "@components/layout";
import { Product } from "@prisma/client";
import { Container } from "@mui/system";
import Item from "@components/item";
import ProductsLoad from "@components/productsLoad";
import { useSession } from "next-auth/react";
import FloatingButton from "@components/floating-button";
import AddIcon from "@mui/icons-material/Add";

interface ProductsResponse {
  ok: boolean;
  products: Product[];
}

export default function Home() {
  const { data: user, status } = useSession();
  // TODO: admin
  const admin = true;

  const { data } = useSWR<ProductsResponse>("/api/products");
  if (!data) {
    return <ProductsLoad />;
  }

  return (
    <Layout>
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

      {admin && (
        <FloatingButton href={`/products/upload`} text="상품 추가하기">
          <AddIcon />
        </FloatingButton>
      )}
    </Layout>
  );
}
