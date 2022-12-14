export const Category: any = {
  "men's clothing": "남성패션",
  "women's clothing": "여성패션",
  electronics: "디지털",
  jewelery: "액세서리",
} as const;

type categoryType = typeof Category[keyof typeof Category];
