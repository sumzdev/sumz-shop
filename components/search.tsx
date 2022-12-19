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
import { SearchFilter } from "pages";
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SearchFilterPrice from "./searchFilterPrice";
import { AutocompleteChangeReason } from "@mui/material";

interface PriceResponse {
  ok: boolean;
  maxPrice: number;
}
interface SearchProps {
  searchFilter: SearchFilter;
  searchPrice: (priceMin: number | "", priceMax: number | "") => void;
  searchCategory: (category: string) => void;
  searchKeyword: (keyword: string) => void;
  productNames: string[];
}

export default function Search({
  searchFilter,
  searchPrice,
  searchCategory,
  searchKeyword,
  productNames,
}: SearchProps) {
  // search form
  const { setValue, getValues, resetField, control } = useForm<SearchFilter>({
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
      searchCategory(selectedCategory);
    },
    [searchCategory, setValue]
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
        searchCategory("");
        break;
      case "price":
        resetField("priceMin");
        resetField("priceMax");
        searchPrice("", "");
        break;
      case "keyword":
        searchKeyword("");
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
            newValue: string[],
            reason: AutocompleteChangeReason
          ) => {
            if (reason === "selectOption") {
              if (newValue instanceof Array) {
                const stringValue = newValue.reduce((acc, v) => acc.concat(v));
                searchKeyword(stringValue);
              } else {
                searchKeyword(newValue);
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
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.code === "Enter") {
                  const inputValue = (event.target as HTMLInputElement).value;
                  if (inputValue) {
                    searchKeyword(inputValue);
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
            prevPriceMin={searchFilter.priceMin}
            prevPriceMax={searchFilter.priceMax}
            searchPrice={searchPrice}
            getValues={getValues}
            control={control}
            setValue={setValue}
            maxPrice={maxPrice}
            handleClose={cancleSelectPrice}
          />
        </Popper>
      </form>

      {searchFilter.keyword !== "" ||
      searchFilter.category !== "" ||
      searchFilter.priceMin !== "" ||
      searchFilter.priceMax !== "" ? (
        <div className="mt-5">
          <Stack direction="row" spacing={1}>
            {searchFilter.keyword && (
              <Chip
                label={searchFilter.keyword}
                onDelete={() => handleDelete("keyword")}
              />
            )}

            {searchFilter.category !== "" && (
              <Chip
                label={CATEGORY[searchFilter.category]}
                onDelete={() => handleDelete("category")}
              />
            )}

            {searchFilter.priceMin !== "" || searchFilter.priceMax !== "" ? (
              <Chip
                label={`${searchFilter.priceMin}원 ~ ${searchFilter.priceMax}원`}
                onDelete={() => handleDelete("price")}
              />
            ) : null}
          </Stack>
        </div>
      ) : null}
    </div>
  );
}
