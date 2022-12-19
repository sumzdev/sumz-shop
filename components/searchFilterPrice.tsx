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
import { SearchForm } from "./search";

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
  control: Control<SearchForm>;
  getValues: UseFormGetValues<SearchForm>;
  setValue: UseFormSetValue<SearchForm>;
  setPriceMin: (min: number | undefined) => void;
  setPriceMax: (max: number | undefined) => void;
  handleClose: () => void;
}

export default function SearchFilterPrice(props: SearchFilterPriceProps) {
  const {
    setPriceMin,
    setPriceMax,
    getValues,
    control,
    handleClose,
    setValue,
  } = props;

  const [selectRange, setSelectRange] = useState("");

  const handleClickAway = useCallback(() => {
    const min = getValues("priceMin");
    const max = getValues("priceMax");
    setValue("priceMinInput", min);
    setValue("priceMaxInput", max);
    setSelectRange("");
    handleClose();
  }, [getValues, handleClose, setValue]);

  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <div className="border px-3 py-5 bg-white shadow-md">
        <div className="flex gap-2 px-10 items-center">
          <Controller
            name="priceMinInput"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="number" sx={{ h: "0.5rem" }} />
            )}
          />
          <div>{"원 ~ "}</div>

          <Controller
            name="priceMaxInput"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="number" sx={{ h: "0.5rem" }} />
            )}
          />
          <div>{" 원"}</div>

          <Button
            variant="contained"
            onClick={() => {
              setPriceMin(getValues("priceMinInput"));
              setPriceMax(getValues("priceMaxInput"));
              console.log(
                getValues("priceMinInput"),
                getValues("priceMaxInput")
              );
              handleClose();
              // TODO: set filter
              // TODO: set chip
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
                      setValue("priceMinInput", priceMin);
                      setValue("priceMaxInput", priceMax);
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
