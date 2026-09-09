import styled from "styled-components";

import { theme } from "../../styles/theme";

/* BookmarkListPage / MyRecipesPage 와 같은 마이페이지 탭 셸. */

export const CardWrap = styled.section`
  flex: 1;
  min-width: 0;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

export const PageBanner = styled.div`
  height: ${theme.space["6xl"]};
  background: linear-gradient(90deg, ${theme.color.primaryHover}, ${theme.color.primary});
`;
