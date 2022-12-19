export const CATEGORY_OPTIONS = [
  { value: "men's clothing", label: "남성패션" },
  { value: "women's clothing", label: "여성패션" },
  { value: "electronics", label: "디지털" },
  { value: "jewelery", label: "액세서리" },
];

export const CATEGORY: Record<string, string> = {
  "men's clothing": "남성패션",
  "women's clothing": "여성패션",
  electronics: "디지털",
  jewelery: "액세서리",
} as const;

type categoryType = typeof CATEGORY[keyof typeof CATEGORY];
