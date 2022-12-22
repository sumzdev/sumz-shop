import { cls } from "@libs/client/utils";
import { MAX_PAGINATION_SIZE, PAGE_SIZE } from "constants/products";

interface PaginationProps {
  count: number;
  pageIndex: number;
  movePageIndex: (pageIdx: number) => void;
}

export default function Pagination({
  count: productCnt,
  pageIndex: curIdx,
  movePageIndex,
}: PaginationProps) {
  const pageCnt = Math.ceil(productCnt / PAGE_SIZE);

  let pageNumList = new Array(pageCnt).fill("").map((_, idx) => idx + 1);
  let startPageNum = 1;
  let endPageNum = MAX_PAGINATION_SIZE;

  if (pageCnt > MAX_PAGINATION_SIZE) {
    const frontPageCnt = Math.ceil((MAX_PAGINATION_SIZE - 1) / 2);
    const rearPageCnt = MAX_PAGINATION_SIZE - 1 - frontPageCnt;

    if (curIdx <= frontPageCnt) {
      startPageNum = 1;
      endPageNum = MAX_PAGINATION_SIZE;
    } else if (pageCnt - curIdx < rearPageCnt) {
      endPageNum = pageCnt;
      startPageNum = curIdx - (MAX_PAGINATION_SIZE - 1 - (pageCnt - curIdx));
    } else {
      startPageNum = curIdx - frontPageCnt;
      endPageNum = curIdx + rearPageCnt;
    }
  }
  pageNumList = pageNumList.slice(startPageNum - 1, endPageNum);

  return (
    <div className="w-full flex gap-3 mx-auto items-center justify-center">
      {startPageNum > 1 ? (
        <>
          <button
            key={`pagination-${1}`}
            onClick={() => movePageIndex(1)}
            className={cls("px-2")}
          >
            {1}
          </button>
          {"..."}
        </>
      ) : null}

      {pageNumList.map((pageIdx) => (
        <button
          key={`pagination-${pageIdx}`}
          onClick={() => movePageIndex(pageIdx)}
          className={cls(
            "px-2",
            pageIdx === curIdx
              ? "text-cyan-700 border-b-2 border-b-cyan-700"
              : ""
          )}
        >
          {pageIdx}
        </button>
      ))}

      {endPageNum < pageCnt ? (
        <>
          {"..."}
          <button
            key={`pagination-${pageCnt}`}
            onClick={() => movePageIndex(pageCnt)}
            className={cls("px-2")}
          >
            {pageCnt}
          </button>
        </>
      ) : null}
    </div>
  );
}
