import { Container, Skeleton } from "@mui/material";

export default function ProductDetailLoad() {
  return (
    <Container className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col md:grid md:grid-cols-2 ">
        <div className="flex w-full mx-auto  items-center justify-center">
          <Skeleton variant="rectangular" width={300} height={300} />
        </div>

        <div className="mt-10 md:mt-0 w-full h-full flex flex-col justify-between">
          <div>
            <Skeleton variant="rectangular" width="100%" height={36} />
            <Skeleton
              variant="rectangular"
              width="150px"
              height={28}
              className="mt-2"
            />
            <p className="text-xl text-gray-600 mt-3 text-right">
              <Skeleton variant="rectangular" width="200px" height={30} />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-8">
            {/* 위시리스트 */}
            <Skeleton variant="rectangular" width="100%" height={60} />

            {/* 장바구니 */}
            <Skeleton variant="rectangular" width="100%" height={60} />
          </div>
        </div>
      </div>

      <div className="my-10 grid gap-3">
        <Skeleton variant="rectangular" width="100%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={30} />
        <Skeleton variant="rectangular" width="70%" height={30} />
      </div>
    </Container>
  );
}
