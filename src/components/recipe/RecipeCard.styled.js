import styled from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

/* 레시피 카드 그리드 (ul). 셀(li)은 행 높이에 맞춰 늘어나고 카드가 그 높이를 채운다. */
export const RecipeCardGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${theme.size.recipeCardMin}, 1fr));
  gap: ${theme.space.xl};

  li {
    display: flex;
  }
`;

/* 카드 루트 = 상세로 가는 Link. (RecipeListPage.styled.js 의 RecipeCard 를 공용으로 옮긴 것) */
export const CardRoot = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${theme.color.bg};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  transition: box-shadow ${theme.transition.base}, transform ${theme.transition.base};

  &:hover {
    box-shadow: ${theme.shadow.md};
    transform: translateY(-2px);
  }
`;

export const CardThumb = styled.div`
  position: relative; /* CardOverlay 절대배치 기준 */
  width: 100%;
  aspect-ratio: ${theme.ratio.thumbnail};
  flex-shrink: 0;
  overflow: hidden;
  background: ${theme.color.gray100}; /* 이미지 로드 실패 시 회색 박스 */

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* 썸네일 우상단 오버레이 자리 (즐겨찾기 하트 등). 내용은 호출부가 overlay prop 으로 넣는다. */
export const CardOverlay = styled.div`
  position: absolute;
  top: ${theme.space.sm};
  right: ${theme.space.sm};
  z-index: 1;
`;

export const CardBody = styled.div`
  display: flex;
  flex: 1; /* 남는 높이를 채워 카드 높이를 행 기준으로 통일 */
  flex-direction: column;
  gap: ${theme.space.sm};
  padding: ${theme.space.lg};
`;

export const CardTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  /* 제목 1줄 말줄임 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;
