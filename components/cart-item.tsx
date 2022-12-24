import useMutation from "@libs/client/useMutation";
import { cls, priceToStr, rgbDataURL } from "@libs/client/utils";
import { Button } from "@mui/material";
import { CATEGORY } from "constants/category";
import Image from "next/image";
import Link from "next/link";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

interface CartItemProps {
  id: number;
  productId: number;
  name: string;
  count: number;
  price: number;
  category: string;
  image: string;
  checked: boolean;
  toggleCheck: () => void;
  setMutateData: (
    type: "increase" | "decrease" | "delete",
    cartId: number
  ) => void;
}

export default function CartItem({
  name,
  id,
  productId,
  price,
  category,
  image,
  count,
  checked,
  toggleCheck,
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
    <div
      className={cls(
        "border-4 flex flex-col w-full overflow-hidden rounded-lg inset-0",
        checked ? "border-cyan-700" : ""
      )}
    >
      <div className="absolute pt-4 pl-4">
        <button type="button" onClick={() => toggleCheck()}>
          {checked ? (
            <CheckBoxIcon fontSize="large" className="text-cyan-700" />
          ) : (
            <CheckBoxOutlineBlankIcon
              fontSize="large"
              className="text-gray-200"
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-2 w-full items-center justify-center ">
        <Link
          href={`/products/${productId}`}
          className="flex w-full mx-auto items-center justify-center h-[10rem] sm:h-[20rem]"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Image
            src={
              image && image !== "" ? image : "https://via.placeholder.com/300"
            }
            alt={name || "product image"}
            width={300}
            height={300}
            placeholder="blur"
            blurDataURL={rgbDataURL(100, 100, 100)}
            className="items-center w-fit overflow-hidden transition-transform duration-300 max-w-[50%] max-h-[50%] sm:max-w-[80%] sm:max-h-[80%]"
            unoptimized={process.env.NODE_ENV !== "production"}
          />
        </Link>

        <div
          className="w-full h-full flex flex-col border-l col-span-2 sm:col-span-1 justify-between"
          onClick={(event) => {
            toggleCheck();
          }}
        >
          <div className="p-4 w-full flex flex-col justify-between">
            <div className="mt-4">
              <div className="flex flex-row justify-between">
                <Link
                  href={`/products/${productId}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <h3 className="text-xl md:text-2xl lg:line-clamp-1 text-ellipsis line-clamp-2">
                    {name}
                  </h3>
                </Link>
                <Button type="button" onClick={onDeleteClick}>
                  <ClearIcon />
                </Button>
              </div>

              {category && (
                <p className="text-sm sm:text-lg mt-4">{CATEGORY[category]}</p>
              )}

              <p className="text-md sm:text-xl">
                {priceToStr(price)}
                {" 원"}
              </p>
            </div>

            <div className="px-0 sm:px-7 pt-10 pb-2 flex flex-col ml-auto gap-3 min-w-[30px]">
              <div
                className="flex gap-3"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
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

          <div className="w-full flex bg-gray-200 items-center text-center justify-center h-[3rem] sm:h-[4rem] bottom-0">
            <p className="sm:text-2xl float-right">
              {priceToStr(price * count)}
              {" 원"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
