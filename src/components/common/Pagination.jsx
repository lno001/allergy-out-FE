import {
  PaginationNav,
  PageButton,
  GroupButton,
} from "../../styles/common.styled";

// 한 그룹에 몇 개의 페이지 번호를 보여줄지. 바꾸고 싶으면 이 숫자만 고치면 됨.
const DEFAULT_GROUP_SIZE = 5;

/**
 * 그룹(묶음) 단위 페이지네이션. 1~5, 6~10, 11~15 ... 이런 식으로 5개씩 묶어서 보여주고,
 * ‹/› 는 한 페이지가 아니라 그룹 전체를 한 번에 이동합니다 (11~15 → ‹ → 6~10).
 * 마지막 그룹은 남는 만큼만 보여줍니다 (예: 전체 18페이지면 마지막 그룹은 16~18).
 * 첫 그룹에서는 ‹ 가, 마지막 그룹에서는 › 가 아예 렌더링되지 않습니다 (비활성화가 아니라 숨김).
 *
 * props
 * - currentPage : number — 현재 페이지 (1부터 시작)
 * - totalPages  : number — 전체 페이지 수 (1 이하면 아무것도 렌더 안 함)
 * - onPageChange: (page: number) => void — 페이지 클릭 시 호출
 * - groupSize   : number — 한 그룹에 보여줄 페이지 개수 (기본 5)
 *
 * 서버 페이지가 0부터면(page=0) 호출 시 page-1 로 변환해서 넘기세요.
 *
 * @example
 * const [page, setPage] = useState(1);
 *
 * <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  groupSize = DEFAULT_GROUP_SIZE,
}) {
  if (totalPages <= 1) return null;

  const groupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  const pageNumbers = [];
  for (let page = groupStart; page <= groupEnd; page += 1) {
    pageNumbers.push(page);
  }

  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;

  return (
    <PaginationNav aria-label="페이지 네비게이션">
      {hasPrevGroup && (
        <GroupButton
          type="button"
          onClick={() => onPageChange(groupStart - 1)}
          aria-label="이전 그룹"
        >
          ‹
        </GroupButton>
      )}

      {pageNumbers.map((page) => (
        <PageButton
          key={page}
          type="button"
          $active={page === currentPage}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </PageButton>
      ))}

      {hasNextGroup && (
        <GroupButton
          type="button"
          onClick={() => onPageChange(groupEnd + 1)}
          aria-label="다음 그룹"
        >
          ›
        </GroupButton>
      )}
    </PaginationNav>
  );
}

export default Pagination;
