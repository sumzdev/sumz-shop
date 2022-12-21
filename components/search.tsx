import useSWR from "swr";
import {
  Autocomplete,
  Button,
  Chip,
  MenuItem,
  Popper,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { CATEGORY_OPTIONS, CATEGORY } from "constants/category";
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SearchFilterPrice from "./searchFilterPrice";
import { AutocompleteChangeReason } from "@mui/material";
import { useRouter } from "next/router";

export interface SearchFilterType {
  keyword: string;
  category: string;
  priceMin: number | "";
  priceMax: number | "";
}

interface PriceResponse {
  ok: boolean;
  maxPrice: number;
}
interface SearchProps {
  search: (
    key: "category" | "price" | "keyword",
    value?: string,
    priceMinMax?: [string | number, string | number]
  ) => void;
  removeFilter: (type: "category" | "price" | "keyword") => void;
  productNames: string[];
}

export default function Search({
  search,
  removeFilter,
  productNames,
}: SearchProps) {
  const router = useRouter();

  // search form
  const { setValue, getValues, resetField, control } =
    useForm<SearchFilterType>({
      defaultValues: {
        keyword: "",
        priceMin: "",
        priceMax: "",
        category: "",
      },
    });

  // keyword
  const [keyword, setKeyword] = useState<string | null>(null);

  // product max price
  const { data: maxPriceData } = useSWR<PriceResponse>("/api/products/price");
  const maxPrice = maxPriceData ? maxPriceData.maxPrice : 0;

  // category
  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedCategory = event.target.value;
      setValue("category", selectedCategory);
      search("category", selectedCategory);
    },
    [search, setValue]
  );

  // price section
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClickPriceBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const cancleSelectPrice = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "popper-price" : undefined;

  const handleDelete = (type: "category" | "price" | "keyword") => {
    switch (type) {
      case "category":
        resetField("category");
        removeFilter("category");
        break;
      case "price":
        resetField("priceMin");
        resetField("priceMax");
        removeFilter("price");
        break;
      case "keyword":
        removeFilter("keyword");
        break;
    }
  };

  return (
    <div className="w-full px-10">
      <form className="w-full flex flex-col sm:grid sm:grid-cols-4 gap-3">
        <Autocomplete
          options={productNames}
          className="col-span-2"
          value={keyword ? [keyword] : null}
          onChange={(
            event: React.SyntheticEvent<Element, Event>,
            newValue: (string | string[])[],
            reason: AutocompleteChangeReason
          ) => {
            if (reason === "selectOption") {
              if (newValue instanceof Array) {
                search("keyword", newValue.join(""));
              } else {
                search("keyword", newValue);
              }
              setKeyword(null);
              (document.activeElement as HTMLElement).blur();
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              fullWidth
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.code === "Enter") {
                  const inputValue = (event.target as HTMLInputElement).value;
                  if (inputValue) {
                    search("keyword", inputValue);
                    setKeyword(null);
                  }
                  (document.activeElement as HTMLElement).blur();
                }
              }}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                onChange={handleChangeCategory}
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
        <Button
          area-describedby={id}
          type="button"
          variant="outlined"
          onClick={handleClickPriceBtn}
          sx={{ fontSize: "1rem" }}
        >
          Price
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end">
          <SearchFilterPrice
            search={search}
            getValues={getValues}
            control={control}
            setValue={setValue}
            maxPrice={maxPrice}
            handleClose={cancleSelectPrice}
            prevPriceMin={
              router.query.priceMin
                ? parseInt(router.query.priceMin.toString())
                : null
            }
            prevPriceMax={
              router.query.priceMax
                ? parseInt(router.query.priceMax.toString())
                : null
            }
          />
        </Popper>
      </form>

      {!!router.query.keyword ||
      !!router.query.category ||
      !!router.query.priceMin ||
      !!router.query.priceMax ? (
        <div className="mt-5">
          <Stack direction="row" spacing={1}>
            {!!router.query.keyword && (
              <Chip
                label={router.query.keyword}
                onDelete={() => handleDelete("keyword")}
              />
            )}

            {!!router.query.category &&
              Object.keys(CATEGORY).includes(
                router.query.category.toString()
              ) && (
                <Chip
                  label={CATEGORY[router.query.category.toString()]}
                  onDelete={() => handleDelete("category")}
                />
              )}

            {!!router.query.priceMin || !!router.query.priceMax ? (
              <Chip
                label={`${router.query.priceMin}원 ~ ${router.query.priceMax}원`}
                onDelete={() => handleDelete("price")}
              />
            ) : null}
          </Stack>
        </div>
      ) : null}
    </div>
  );
}
