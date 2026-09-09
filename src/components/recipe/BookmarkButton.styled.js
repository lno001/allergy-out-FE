import styled from "styled-components";

import { theme } from "../../styles/theme";

/* 썸네일에 얹는 원형 즐겨찾기 토글 (RecipeCard 공용). */
export const BookmarkFab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.color.bg};
  box-shadow: ${theme.shadow.sm};
  font-size: ${theme.fontSize.md};
  line-height: 1;
  transition: transform ${theme.transition.fast};

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
