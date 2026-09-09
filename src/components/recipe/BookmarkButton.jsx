import useBookmarkToggle from "../../hooks/useBookmarkToggle";
import { BookmarkFab } from "./BookmarkButton.styled";

/**
 * 레시피 카드 썸네일 위에 얹는 즐겨찾기 토글(원형 하트).
 * 카드 전체가 <Link> 이므로 클릭이 상세 이동으로 새지 않도록 preventDefault + stopPropagation.
 * 낙관적 갱신·에러 롤백·비로그인 안내는 useBookmarkToggle 이 담당.
 *
 * @param {{
 *   recipeNo: number,
 *   isBookmarked?: boolean,
 *   className?: string,
 *   onCommit?: (bookmarked: boolean) => void,
 * }} props
 */
function BookmarkButton({ recipeNo, isBookmarked, className, onCommit }) {
  const { bookmarked, pending, toggle } = useBookmarkToggle({
    recipeNo,
    initialBookmarked: isBookmarked,
    onCommit,
  });

  return (
    <BookmarkFab
      type="button"
      className={className}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      disabled={pending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      }}
    >
      {bookmarked ? "❤️" : "🤍"}
    </BookmarkFab>
  );
}

export default BookmarkButton;
