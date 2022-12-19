import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import {
  Button,
  InputLabel,
  MenuItem,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Product } from "@prisma/client";
import { CATEGORY_OPTIONS } from "constants/category";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface UploadProductForm {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const UPLOAD_HELPER = {
  NAME: {
    required: "상품명을 입력해 주세요.",
    duplicate: "이미 존재하는 상품명 입니다.",
  },
  PRICE: {
    required: "상품 가격을 입력해 주세요.",
    pattern: "0 이상의 원 단위 가격을 입력해주세요.",
  },
  CATEGORY: {
    required: "카테고리를 선택해 주세요.",
  },
};

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<UploadProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      image: "",
      category: "",
      description: "",
    },
  });

  const [uploadProduct, { loading, data }] = useMutation("/api/products");

  const onValid = (data: UploadProductForm) => {
    if (loading) return;
    console.log("upload product: ", data);
    uploadProduct(data);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <Layout admin>
      <form
        onSubmit={handleSubmit(onValid)}
        className="gap-3 flex flex-col items-center justify-center w-full md:w-3/4 mx-auto my-3"
      >
        <Controller
          name="name"
          control={control}
          rules={{
            required: { value: true, message: UPLOAD_HELPER.NAME.required },
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
            required: { value: true, message: UPLOAD_HELPER.CATEGORY.required },
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
            required: { value: true, message: UPLOAD_HELPER.PRICE.required },
            pattern: {
              value: /^\d+$/,
              message: UPLOAD_HELPER.PRICE.pattern,
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
          sx={{ mt: 3, mb: 10, py: 1.7 }}
        >
          상품 등록
        </Button>
      </form>
    </Layout>
  );
};

export default Upload;
