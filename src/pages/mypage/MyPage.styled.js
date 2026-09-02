import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

/**
 * GlobalStyle.js의 .container 유틸(max-width 1200px, 가운데 정렬)을 그대로 쓰고
 * 여기서는 사이드바+탭 콘텐츠 flex 배치만 얹는다.
 */
export const PageWrap = styled.div.attrs({ className: "container" })`
  display: flex;
  align-items: flex-start;
  gap: ${theme.space["2xl"]};
  padding-block: ${theme.space["3xl"]};
`;

/* 32rem은 theme space 스케일(최대 6.4rem)로 못 나타내는 사이드바 고정폭.
   common.styled.js ModalBox의 max-width 하드코딩과 같은 이유로 예외 허용. */
export const SidebarWrap = styled.aside`
  width: 32rem;
  flex-shrink: 0;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

export const ProfileSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space["3xl"]} ${theme.space.xl};
  border-bottom: 1px solid ${theme.color.gray100};
`;

export const ProfileName = styled.p`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const ProfileEmail = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: ${theme.space.md};
  gap: ${theme.space.xs};
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  padding: ${theme.space.md} ${theme.space.lg};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
  transition: background-color ${theme.transition.fast}, color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.bgSoft};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${theme.color.primary50};
      color: ${theme.color.primary700};
      font-weight: ${theme.fontWeight.bold};
      box-shadow: inset 3px 0 0 ${theme.color.primary};
    `}
`;

export const NavIcon = styled.span`
  display: inline-flex;
  width: ${theme.space.xl};
  font-size: ${theme.fontSize.lg};
  line-height: 1;
`;
