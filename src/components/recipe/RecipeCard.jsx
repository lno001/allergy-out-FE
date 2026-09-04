import {
  CardBody,
  CardMeta,
  CardOverlay,
  CardRoot,
  CardThumb,
  CardTitle,
} from "./RecipeCard.styled";

/** 레시피 상세 경로. 라우트: /recipe/:recipeNo (App.jsx) */
export const recipeDetailPath = (recipeNo) => `/recipe/${recipeNo}`;

/** 이미지 로드 실패 시 깨진 아이콘 대신 숨긴다 (회색 박스만 남음). */
const hideBrokenImage = (e) => {
  e.currentTarget.style.visibility = "hidden";
};

/**
 * @typedef {Object} RecipeCardData
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipesImgPath - 대표 이미지 S3 URL (없으면 회색 박스)
 * @property {string} createDate - 작성일 문자열
 * @property {string} memberName - 작성자
 *
 * @typedef {Object} RecipeCardProps
 * @property {RecipeCardData} recipe
 * @property {import('react').ReactNode} [overlay] - 썸네일 우상단에 얹을 요소(즐겨찾기 하트 등).
 *   카드 전체가 Link 이므로, overlay 내부 클릭 핸들러에서 e.preventDefault() + e.stopPropagation()
 *   으로 상세 이동을 막을 것.
 */

/**
 * 레시피 카드 (공용) — 레시피 목록 / 즐겨찾기 / 내 작성 레시피에서 함께 쓴다.
 * 카드 전체가 상세 페이지로 가는 Link. `RecipeCardGrid`(ul) 안에서 렌더한다.
 *
 * @param {RecipeCardProps} props
 */
function RecipeCard({ recipe, overlay }) {
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
          {overlay && <CardOverlay>{overlay}</CardOverlay>}
        </CardThumb>
        <CardBody>
          <CardTitle>{recipe.recipeTitle}</CardTitle>
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
