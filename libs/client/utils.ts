import { ParsedUrlQuery } from "querystring";

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const getParams = (query: ParsedUrlQuery): URLSearchParams => {
  const queryArr = Object.keys(query)
    .filter((key) => key !== "object Object")
    .map((key) => [key, query[key].toString()]);

  const params = new URLSearchParams(queryArr);
  return params;
};

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export const priceToStr = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
