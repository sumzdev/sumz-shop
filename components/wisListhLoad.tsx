import { Skeleton, TextField } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function WishlistLoad() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-10">
      <div className="w-full mt-10 mb-14 grid gap-10 lg:grid-cols-3">
        {/* Items */}
        {[1, 1, 1].map((_, idx) => (
          <div
            className="border flex flex-col w-full overflow-hidden"
            key={idx}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <div className="grid grid-cols-2 lg:flex lg:flex-col w-full">
                <div className="flex w-full mx-auto items-center justify-center h-80 mt-12 lg:h-50">
                  <Skeleton
                    variant="rectangular"
                    width="300px"
                    height={"300px"}
                  />
                </div>

                <div className="p-4 w-full flex flex-col justify-between">
                  <div className="">
                    <Skeleton
                      variant="rectangular"
                      width={"10rem"}
                      height="2rem"
                      className="mt-5"
                    />

                    <Skeleton
                      variant="rectangular"
                      width="4rem"
                      height={"1.5rem"}
                      className="mt-5 mb-2"
                    />
                  </div>
                  <div className="w-full flex justify-end">
                    <Skeleton
                      variant="rectangular"
                      width="100px"
                      height={"1.2rem"}
                    />
                  </div>
                </div>
                <div className="absolute pt-3 pl-3">
                  <FavoriteIcon fontSize="large" className="text-pink-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
