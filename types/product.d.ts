import { Product } from "@prisma/client";

export interface IFavInfo {
  id: number;
  userId: number;
  productId: number;
}

export interface ProductWithFavData extends Product {
  favlist: IFavInfo[];
}

export interface ProductWithFav extends Product {
  isFav: boolean;
}
