import { EMPTY_TEXT, formatMeasure, isBlankValue } from "../../constants/recipe";
import BookmarkButton from "./BookmarkButton";
import {
  CardBody,
  CardBookmarkSlot,
  CardCalorie,
  CardMainIngredient,
  CardMeta,
  CardMethod,
  CardRoot,
  CardSpecRow,
  CardThumb,
  CardTitle,
  CardTypeBadge,
  CardViewCount,
} from "./RecipeCard.styled";

/** 레시피 상세 경로. 라우트: /recipe/:recipeNo (App.jsx) */
export const recipeDetailPath = (recipeNo) => `/recipe/${recipeNo}`;

/** 이미지 로드 실패 시 깨진 아이콘 대신 숨긴다 (회색 박스만 남음). */
const hideBrokenImage = (event) => {
  event.currentTarget.style.visibility = "hidden";
};

/** 눈 아이콘 — 조회수 뱃지. 라이브러리 없이 인라인 SVG. */
function EyeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * @typedef {Object} RecipeCardData
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipesImgPath  대표 이미지 S3 URL (없으면 회색 박스)
 * @property {string} createDate      작성일 문자열
 * @property {string} memberName      작성자
 * @property {string} [recipeType]    요리 종류 (밥/국&찌개/…)
 * @property {string} [cookingMethod] 조리 방법 (굽기/튀기기/…)
 * @property {(number|null)} [calorie]      칼로리(kcal)
 * @property {(string|null)} [mainMaterial] 메인 재료 1개
 * @property {number} [viewCount]     조회수
 * @property {boolean} [isBookmarked] 로그인 사용자의 즐겨찾기 여부 (하트 초기값)
 *
 * @typedef {Object} RecipeCardProps
 * @property {RecipeCardData} recipe
 * @property {boolean} [showBookmark=true] 썸네일 즐겨찾기 토글 노출 여부
 * @property {(bookmarked: boolean, recipe: RecipeCardData) => void} [onBookmarkCommit]
 *   즐겨찾기 변경이 서버에 반영 확정됐을 때 호출. 즐겨찾기 목록 화면이 그 시점에 재조회로
 *   목록·페이지수를 재동기화하는 데 쓴다. (하드 실패/롤백 시엔 호출 안 됨)
 */

/**
 * 레시피 카드 (공용) — 레시피 목록 / 즐겨찾기 / 내 작성 레시피에서 함께 쓴다.
 * 카드 전체가 상세로 가는 Link. 썸네일 위에 즐겨찾기 토글 + 조회수 뱃지.
 * type/method/calorie/mainMaterial/viewCount 는 값이 없으면 그 줄만 접거나 "미입력".
 * `RecipeCardGrid`(ul) 또는 목록 페이지의 `RecipeGrid`(ul) 안에서 렌더한다.
 *
 * @param {RecipeCardProps} props
 */
function RecipeCard({ recipe, showBookmark = true, onBookmarkCommit }) {
  return (
    <li>
      <CardRoot to={recipeDetailPath(recipe.recipeNo)}>
        <CardThumb>
          <img
            src={recipe.recipesImgPath}
            alt={recipe.recipeTitle}
            loading="lazy"
            onError={hideBrokenImage}
          />

          {showBookmark && (
            <CardBookmarkSlot>
              <BookmarkButton
                recipeNo={recipe.recipeNo}
                isBookmarked={recipe.isBookmarked}
                onCommit={
                  onBookmarkCommit
                    ? (bookmarked) => onBookmarkCommit(bookmarked, recipe)
                    : undefined
                }
              />
            </CardBookmarkSlot>
          )}

          {!isBlankValue(recipe.viewCount) && (
            <CardViewCount>
              <EyeIcon />
              {Number(recipe.viewCount).toLocaleString()}
            </CardViewCount>
          )}
        </CardThumb>

        <CardBody>
          <CardTitle>{recipe.recipeTitle}</CardTitle>

          {(recipe.recipeType || recipe.cookingMethod) && (
            <CardSpecRow>
              {recipe.recipeType && (
                <CardTypeBadge>{recipe.recipeType}</CardTypeBadge>
              )}
              {recipe.cookingMethod && (
                <CardMethod>{recipe.cookingMethod}</CardMethod>
              )}
            </CardSpecRow>
          )}

          <CardCalorie>
            {isBlankValue(recipe.calorie)
              ? EMPTY_TEXT
              : formatMeasure(recipe.calorie, "kcal")}
          </CardCalorie>

          <CardMainIngredient>
            주재료 ·{" "}
            {isBlankValue(recipe.mainMaterial) ? EMPTY_TEXT : recipe.mainMaterial}
          </CardMainIngredient>

          <CardMeta>
            <span>{recipe.createDate}</span>
            <span>{recipe.memberName}</span>
          </CardMeta>
        </CardBody>
      </CardRoot>
    </li>
  );
}

export default RecipeCard;
