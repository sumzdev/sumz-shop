import { Box, Button, ClickAwayListener, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  UseFormGetValues,
  UseFormSetValue,
  Controller,
  Control,
} from "react-hook-form";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { SearchFilterType } from "./search";

interface PriceRangeType {
  priceMin: number;
  priceMax: number;
  name: string;
}

const PRICE_RANGE: Record<string, PriceRangeType> = {
  TOTAL: {
    priceMin: 0,
    priceMax: 0,
    name: "전체",
  },
  LESS_5: {
    priceMin: 0,
    priceMax: 50000,
    name: "~ 50,000원",
  },
  MORE_5: {
    priceMin: 50000,
    priceMax: 100000,
    name: "50,000원 ~ 100,000원",
  },
  MORE_10: {
    priceMin: 100000,
    priceMax: 200000,
    name: "100,000원 ~ 200,000원 ",
  },
  MORE_20: {
    priceMin: 200000,
    priceMax: 0,
    name: "200,000원 ~",
  },
};

interface SearchFilterPriceProps {
  // setValue: UseFormSetValue<SearchForm>;
  control: Control<SearchFilterType>;
  getValues: UseFormGetValues<SearchFilterType>;
  setValue: UseFormSetValue<SearchFilterType>;
  maxPrice: number;
  search: (
    key: "category" | "price" | "keyword",
    value?: string,
    priceMinMax?: [string | number, string | number]
  ) => void;
  prevPriceMin: number;
  prevPriceMax: number;
  handleClose: () => void;
}

export default function SearchFilterPrice(props: SearchFilterPriceProps) {
  const {
    control,
    getValues,
    setValue,
    maxPrice,
    search,
    prevPriceMin,
    prevPriceMax,
    handleClose,
  } = props;

  const [selectRange, setSelectRange] = useState("");

  const handleClickAway = useCallback(() => {
    setValue("priceMin", prevPriceMin);
    setValue("priceMax", prevPriceMax);
    setSelectRange("");
    handleClose();
  }, [handleClose, prevPriceMax, prevPriceMin, setValue]);

  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <div className="border px-3 py-5 bg-white shadow-md">
        <div className="flex gap-2 px-10 items-center">
          <Controller
            name="priceMin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                sx={{ h: "0.5rem" }}
                placeholder="0"
              />
            )}
          />
          <div>{"원 ~ "}</div>

          <Controller
            name="priceMax"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                sx={{ h: "0.5rem" }}
                placeholder={String(maxPrice)}
              />
            )}
          />
          <div>{" 원"}</div>

          <Button
            variant="contained"
            onClick={() => {
              const inputMin = getValues("priceMin");
              const inputMax = getValues("priceMax");
              const setMinPrice = !inputMin ? 0 : inputMin;
              const setMaxPrice = !inputMax ? maxPrice : inputMax;
              search("price", "", [setMinPrice, setMaxPrice]);
              handleClose();
            }}
          >
            적용
          </Button>
        </div>

        <hr className="my-3" />

        <div>
          <ul>
            {Object.entries(PRICE_RANGE).map(
              ([value, { name, priceMin, priceMax }]) => (
                <li key={value}>
                  <Button
                    onClick={() => {
                      setValue("priceMin", priceMin);
                      setValue("priceMax", priceMax);
                      setSelectRange(value);
                    }}
                  >
                    {selectRange === value ? (
                      <RadioButtonCheckedIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                    <span className="pl-2">{name}</span>
                  </Button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  );
}
