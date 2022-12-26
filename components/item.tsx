import { priceToStr, rgbDataURL } from "@libs/client/utils";
import { CATEGORY } from "constants/category";
import Image from "next/image";
import Link from "next/link";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import { useCallback } from "react";

interface ItemProps {
  name: string;
  id: number;
  price: number;
  category: string;
  image: string;
  isFav: boolean;
  toggleFavMutate: () => void;
  moveProduct: () => void;
}

interface IFavResponse {
  ok: boolean;
  isFav: boolean;
}

export default function Item({
  name,
  id,
  price,
  category,
  image,
  moveProduct,
  toggleFavMutate,
  isFav,
}: ItemProps) {
  const [toggleFav] = useMutation<IFavResponse>(`/api/products/${id}/fav`);

  const onToggleFav = useCallback(() => {
    toggleFav({});
    toggleFavMutate();
  }, [toggleFav, toggleFavMutate]);

  return (
    <div
      className="border flex flex-col w-full overflow-hidden group cursor-pointer"
      onClick={moveProduct}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="grid grid-cols-2 lg:flex lg:flex-col w-full">
          <div className="flex w-full mx-auto items-center justify-center h-80 lg:h-50">
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
              className="items-center w-fit overflow-hidden transition-transform duration-300 max-w-[50%] max-h-[50%] group-hover:scale-125"
              unoptimized={process.env.NODE_ENV !== "production"}
            />
          </div>

          <div className="p-4 w-full flex flex-col justify-between">
            <div className="">
              <h1 className="text-xl md:text-3xl lg:text-xl lg:line-clamp-1">
                {name}
              </h1>
              {category && (
                <p className="text-lg lg:text-md mt-4">{CATEGORY[category]}</p>
              )}
            </div>
            <p className="text-xl lg:text-base text-gray-600 pr-4 text-right">
              {priceToStr(price)} 원
            </p>
          </div>

          <div className="absolute pt-3 pl-3">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFav();
              }}
            >
              {isFav ? (
                <FavoriteIcon fontSize="large" className="text-pink-500" />
              ) : (
                <FavoriteBorderIcon
                  fontSize="large"
                  className="text-gray-300"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
