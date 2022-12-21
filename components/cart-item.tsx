import useMutation from "@libs/client/useMutation";
import { rgbDataURL } from "@libs/client/utils";
import { Button } from "@mui/material";
import { CATEGORY } from "constants/category";
import Image from "next/image";
import Link from "next/link";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback } from "react";

interface CartItemProps {
  id: number;
  productId: number;
  name: string;
  count: number;
  price: number;
  category: string;
  image: string;
  setMutateData: (
    type: "increase" | "decrease" | "delete",
    cartId: number
  ) => void;
}

export default function CartItem({
  name,
  id,
  price,
  category,
  image,
  count,
  setMutateData,
}: CartItemProps) {
  const [increaseCount, { data: increaseRes }] = useMutation(
    `/api/users/cart/${id}/increase`
  );
  const [decreaseCount, { data: decreaseRes }] = useMutation(
    `/api/users/cart/${id}/decrease`
  );
  const [deleteCart, { data: deleteRes }] = useMutation(
    `/api/users/cart/${id}/delete`
  );

  const onIncreaseClick = useCallback(() => {
    setMutateData("increase", id);
    increaseCount({});
  }, [id, increaseCount, setMutateData]);
  const onDecreaseClick = useCallback(() => {
    setMutateData("decrease", id);
    decreaseCount({});
  }, [decreaseCount, id, setMutateData]);
  const onDeleteClick = useCallback(() => {
    setMutateData("delete", id);
    deleteCart({});
  }, [deleteCart, setMutateData, id]);

  return (
    <div className="border flex flex-col w-full overflow-hidden rounded-lg">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="grid grid-cols-2 w-full">
          <Link
            href={`/products/${id}`}
            className="flex w-full mx-auto items-center justify-center h-80 lg:h-50"
          >
            <Image
              src={
                image && image !== ""
                  ? image
                  : "https://via.placeholder.com/300"
              }
              alt={name || "product image"}
              width={300}
              height={300}
              placeholder="blur"
              blurDataURL={rgbDataURL(100, 100, 100)}
              className="items-center w-fit overflow-hidden transition-transform duration-300 max-w-[100%] max-h-[100%]"
              unoptimized={process.env.NODE_ENV !== "production"}
            />
          </Link>

          <div className="w-full h-full flex flex-col border-l">
            <div className="p-4 w-full flex flex-col justify-between">
              <div className="mt-4">
                <div className="flex flex-row justify-between">
                  <Link href={`/products/${id}`}>
                    <h1 className="text-2xl md:text-3xl  lg:line-clamp-1">
                      {name}
                    </h1>
                  </Link>
                  <Button onClick={onDeleteClick}>
                    <ClearIcon />
                  </Button>
                </div>

                {category && (
                  <p className="text-lg lg:text-md mt-4">
                    {CATEGORY[category]}
                  </p>
                )}

                <p>
                  {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원
                </p>
              </div>

              <div className="px-0 sm:px-7 pt-10 pb-2 flex flex-col ml-auto gap-3 min-w-[30px]">
                <div className="flex gap-3">
                  <Button
                    onClick={onDecreaseClick}
                    variant="contained"
                    sx={{ minWidth: "0.5rem" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <p className="sm:text-xl text-gray-60 min-w-[40px] text-center">
                    {count}
                  </p>
                  <Button
                    onClick={onIncreaseClick}
                    variant="contained"
                    sx={{ minWidth: "0.3rem" }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex bg-gray-200 items-center text-center justify-center ">
              <p className="sm:text-2xl float-right">
                {(price * count)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
