import styled from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

/* 레시피 카드 그리드 (ul) — 마이페이지(즐겨찾기 / 내 레시피)에서 사용.
   레시피 목록 페이지는 자체 4열 고정 그리드(RecipeListPage.styled 의 RecipeGrid)를 쓴다. */
export const RecipeCardGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${theme.size.recipeCardMin}, 1fr));
  gap: ${theme.space.xl};

  li {
    display: flex;
    min-width: 0;
  }
`;

/* 카드 루트 = 상세로 가는 Link. 테두리 없이 이미지 위주, hover 시 살짝 떠오름. */
export const CardRoot = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: transform ${theme.transition.base};

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardThumb = styled.div`
  position: relative; /* 즐겨찾기 토글 / 조회수 뱃지 오버레이 기준 */
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${theme.radius.sm};
  background: ${theme.color.gray100}; /* 이미지 로드 실패 시 회색 박스 */
  box-shadow: ${theme.shadow.sm};
  transition: box-shadow ${theme.transition.base};

  ${CardRoot}:hover & {
    box-shadow: ${theme.shadow.lg};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* 즐겨찾기 토글 — 썸네일 왼쪽 위 (조회수 뱃지는 오른쪽 위라 안 겹침) */
export const CardBookmarkSlot = styled.div`
  position: absolute;
  top: ${theme.space.sm};
  left: ${theme.space.sm};
  z-index: 1;
`;

/* 조회수 — 썸네일 오른쪽 위 구석 오버레이 뱃지 */
export const CardViewCount = styled.span`
  position: absolute;
  top: ${theme.space.sm};
  right: ${theme.space.sm};
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.white};
  background: ${theme.color.scrim};
  border-radius: ${theme.radius.full};

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${theme.space.xs};
  padding: ${theme.space.md} ${theme.space.xs} 0;
`;

export const CardTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  line-height: ${theme.lineHeight.tight};

  /* 2줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* 요리종류(뱃지) + 조리방법(텍스트) 한 줄 */
export const CardSpecRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
`;

/* 요리 종류 — 알약 뱃지 (6값 공통 1색). 목록 페이지의 "오늘의 추천" 카드도 재사용. */
export const CardTypeBadge = styled.span`
  flex-shrink: 0;
  padding: 0.2rem ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.primary700};
  background: ${theme.color.primary50};
  border-radius: ${theme.radius.full};
`;

/* 조리 방법 — 뱃지 옆 보조 텍스트 */
export const CardMethod = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

/* 칼로리 한 줄 — "684 kcal" / 값 없으면 "미입력" */
export const CardCalorie = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

/* 주재료 (mainMaterial 1개) — 한 줄, 넘치면 말줄임. 없으면 "미입력" */
export const CardMainIngredient = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  margin-top: auto;
  padding-top: ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};

  /* 날짜와 작성자 사이 가운뎃점 */
  & > span:not(:last-child)::after {
    content: "·";
    margin-left: ${theme.space.xs};
  }
`;
