import { rgbDataURL } from "@libs/client/utils";
import { Button, Container } from "@mui/material";
import { Category } from "constants/category";
import Image from "next/image";
import Link from "next/link";

interface ItemProps {
  name: string;
  id: number;
  price: number;
  category: string;
  image: string;
}

export default function Item({ name, id, price, category, image }: ItemProps) {
  return (
    <Link
      className="border flex flex-col w-full overflow-hidden group"
      href={`products/${id}`}
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
                <p className="text-lg lg:text-md mt-4">{Category[category]}</p>
              )}
            </div>
            <p className="text-xl lg:text-base text-gray-600 pr-4 text-right">
              {price} 원
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
