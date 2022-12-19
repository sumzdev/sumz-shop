import {
  Autocomplete,
  Button,
  MenuItem,
  Popper,
  TextField,
} from "@mui/material";
import { CATEGORY_OPTIONS } from "constants/category";
import { SearchFilter } from "pages";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SearchFilterPrice from "./searchFilterPrice";

interface SearchProps {
  searchPrice: (priceMin: number, priceMax: number) => void;
  searchCategory: (category: string) => void;
  searchKeyword: (keyword: string) => void;
}

export interface SearchForm extends SearchFilter {
  priceMinInput: number;
  priceMaxInput: number;
}

const sampleOption = [];

export default function Search({
  searchPrice,
  searchCategory,
  searchKeyword,
}: SearchProps) {
  // search form
  const { setValue, getValues, watch, register, handleSubmit, control } =
    useForm<SearchForm>({
      defaultValues: {
        keyword: "",
        priceMin: 0,
        priceMax: 0,
        priceMinInput: 0,
        priceMaxInput: 0,
        category: "",
      },
    });

  const setPriceMin = useCallback(
    (min: number | undefined) => {
      setValue("priceMin", min);
    },
    [setValue]
  );

  const setPriceMax = useCallback(
    (max: number | undefined) => {
      setValue("priceMax", max);
    },
    [setValue]
  );

  // price section
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClickPriceBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const closePriceBox = useCallback(() => {
    setAnchorEl(null);
    console.log("close");
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "popper-price" : undefined;

  return (
    <div className="w-full px-10">
      <form className="w-full flex flex-col sm:grid sm:grid-cols-4 gap-3">
        <Controller
          name="keyword"
          control={control}
          render={() => (
            <Autocomplete
              options={sampleOption}
              className="col-span-2"
              renderInput={(params) => (
                <TextField {...params} label="Search" fullWidth />
              )}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
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
            setPriceMin={setPriceMin}
            setPriceMax={setPriceMax}
            getValues={getValues}
            control={control}
            setValue={setValue}
            handleClose={closePriceBox}
          />
        </Popper>

        {watch("priceMin")}
        {" / "}
        {watch("priceMax")}
      </form>
    </div>
  );
}
