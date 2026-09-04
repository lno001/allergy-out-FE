import styled from "styled-components";

import { theme } from "../../styles/theme";

export const CardWrap = styled.section`
  flex: 1;
  min-width: 0;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

/* ProfileEditPage 의 CardBanner 와 같은 초록 그라디언트 띠. 즐겨찾기 탭에선 내용 없이 장식만. */
export const PageBanner = styled.div`
  height: ${theme.space["6xl"]};
  background: linear-gradient(90deg, ${theme.color.primaryHover}, ${theme.color.primary});
`;

export const Content = styled.div`
  padding: ${theme.space["2xl"]};
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const SectionDescription = styled.p`
  margin-top: ${theme.space.xs};
  padding-bottom: ${theme.space.lg};
  border-bottom: 1px solid ${theme.color.gray100};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

/* 페이지 전환 중(isFetching)엔 기존 목록을 유지한 채 살짝 흐리게 → 빈 화면 깜빡임 방지 */
export const GridArea = styled.div`
  margin-top: ${theme.space.xl};
  transition: opacity ${theme.transition.fast};
  opacity: ${({ $dim }) => ($dim ? 0.55 : 1)};
  pointer-events: ${({ $dim }) => ($dim ? "none" : "auto")};
`;

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.space["2xl"]};
`;

export const EmptyState = styled.div`
  padding: ${theme.space["5xl"]} 0;
  text-align: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

/* 썸네일 우상단 하트. 카드 전체가 Link 라 onClick 에서 preventDefault + stopPropagation 한다. */
export const HeartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${theme.space.xl};
  height: ${theme.space.xl};
  border-radius: ${theme.radius.full};
  background-color: ${theme.color.bg};
  box-shadow: ${theme.shadow.sm};
  font-size: ${theme.fontSize.sm};
  line-height: 1;
  transition: transform ${theme.transition.fast};

  &:hover {
    transform: scale(1.1);
  }
`;
