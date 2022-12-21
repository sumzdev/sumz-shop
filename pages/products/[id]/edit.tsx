import useSWR from "swr";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import {
  Button,
  InputLabel,
  MenuItem,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Product, Role } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CATEGORY_OPTIONS } from "constants/category";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface EditProductForm {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductInfoResponse {
  ok: boolean;
  product: Product;
}

interface ProductDeleteResponse {
  ok: boolean;
}

interface EditProps {
  session: Session;
}

const uploadHelper = {
  name: {
    required: "상품명을 입력해 주세요.",
    duplicate: "이미 존재하는 상품명 입니다.",
  },
  price: {
    required: "상품 가격을 입력해 주세요.",
    pattern: "0 이상의 원 단위 가격을 입력해주세요.",
  },
  category: {
    required: "카테고리를 선택해 주세요.",
  },
};

function Edit({ session }: EditProps) {
  const router = useRouter();

  const { setValue, handleSubmit, control } = useForm<EditProductForm>({
    defaultValues: {
      id: parseInt(router.query.id.toString()),
      name: "",
      price: 0,
      image: "",
      category: "",
      description: "",
    },
  });

  const [editProduct, { loading, data: updateData }] = useMutation(
    `/api/products/${router.query.id}/edit`
  );
  const [deleteProduct, { loading: deleteLoading, data: deleteData }] =
    useMutation(`/api/products/${router.query.id}/delete`);

  const { data } = useSWR<ProductInfoResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const product = data?.product;

  useEffect(() => {
    if (product?.name) setValue("name", product.name);
    if (product?.price) setValue("price", product.price);
    if (product?.image) setValue("image", product.image);
    if (product?.description) setValue("description", product.description);
    if (product?.category) setValue("category", product.category);
    if (product?.id) setValue("id", product.id);
  }, [setValue, product]);

  useEffect(() => {
    if (updateData?.ok) {
      router.push(`/products/${updateData.product.id}`);
    }
  }, [updateData, router]);

  useEffect(() => {
    if (deleteData?.ok) {
      router.push("/");
    }
  }, [deleteData, router]);

  if (!data?.ok) {
    return <div>Loading...</div>;
  }
  if (data?.ok && !data) {
    router.push("/products/upload");
  }

  const onValid = (data: EditProductForm) => {
    if (loading) return;
    editProduct(data);
  };

  const onDeleteClick = () => {
    if (deleteLoading) return;
    deleteProduct({});
  };

  // TODO: 미들웨어
  if (session?.user?.role !== Role.ADMIN) {
    router.push("/");
  }

  return (
    <Layout admin={session?.user?.role === Role.ADMIN} login={!!session?.user}>
      <form
        onSubmit={handleSubmit(onValid)}
        className="gap-3 flex flex-col items-center justify-center w-full md:w-3/4 mx-auto my-3"
      >
        <Controller
          name="name"
          control={control}
          rules={{
            required: { value: true, message: uploadHelper.name.required },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Product Name"
              autoFocus
              fullWidth
              error={!!error}
              helperText={error ? error.message : ""}
            />
          )}
        />

        <Controller
          name="image"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Image Url" fullWidth />
          )}
        />

        <Controller
          name="category"
          control={control}
          rules={{
            required: { value: true, message: uploadHelper.category.required },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                {...field}
                select
                label="Category"
                // labelWidth={"Category".length * 9}
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{
            required: { value: true, message: uploadHelper.price.required },
            pattern: {
              value: /^\d+$/,
              message: uploadHelper.price.pattern,
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Price"
              fullWidth
              error={!!error}
              type="number"
              helperText={error ? error.message : ""}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="mt-5 w-full">
              <InputLabel htmlFor="product-upload-description">
                Details
              </InputLabel>
              <TextareaAutosize
                {...field}
                id="product-upload-description"
                aria-label="Description"
                className="w-full border p-5"
              />
            </div>
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.7 }}
        >
          상품 수정
        </Button>

        <Button
          onClick={onDeleteClick}
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 10, py: 1.7, backgroundColor: "#c62828" }}
        >
          상품 삭제
        </Button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

export default Edit;
