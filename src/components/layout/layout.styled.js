import styled from "styled-components";

import { theme } from "../../styles/theme";

/* ============================================================
   Header
   ============================================================ */

export const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding-inline: ${theme.space["2xl"]};
  background-color: ${theme.color.bg};
  border-bottom: 1px solid ${theme.color.gray200};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.header};
`;

export const HeaderLogo = styled.a`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.primary800};
`;

export const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.space["2xl"]};
`;

export const HeaderNavLink = styled.a`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.sub};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.text};
  }
`;

export const HeaderUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
`;

/* ============================================================
   MyPage — Sidebar + content 2단 레이아웃
   ============================================================ */

export const MyPageGrid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: ${theme.space["2xl"]};
  max-width: 1200px;
  margin-inline: auto;
  padding: ${theme.space["2xl"]};
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  padding: ${theme.space.md};
`;

export const SidebarLink = styled.a`
  display: block;
  padding: ${theme.space.md} ${theme.space.lg};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  transition: background-color ${theme.transition.fast}, color ${theme.transition.fast};

  ${({ $active }) => ($active
    ? `
      background-color: ${theme.color.primary50};
      color: ${theme.color.primary700};
      font-weight: ${theme.fontWeight.semibold};
    `
    : `
      color: ${theme.color.sub};
      &:hover { background-color: ${theme.color.bgSoft}; color: ${theme.color.text}; }
    `)}
`;

/* ============================================================
   Footer
   ============================================================ */

export const FooterWrapper = styled.footer`
  margin-top: ${theme.space["4xl"]};
  border-top: 1px solid ${theme.color.gray200};
  background-color: ${theme.color.bg};
`;

export const FooterInner = styled.div`
  max-width: 1200px;
  margin-inline: auto;
  padding: ${theme.space["3xl"]} ${theme.space["2xl"]};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${theme.space["2xl"]};
`;

export const FooterBrand = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.primary800};
`;

export const FooterColumns = styled.div`
  display: flex;
  gap: ${theme.space["4xl"]};
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const FooterColumnTitle = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.sub};
`;

export const FooterLink = styled.a`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};

  &:hover {
    color: ${theme.color.primaryHover};
  }
`;

export const FooterContactCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  padding: ${theme.space.lg};
  background-color: ${theme.color.primary50};
  border-radius: ${theme.radius.lg};
  min-width: 220px;
`;

export const FooterCopyright = styled.div`
  padding: ${theme.space.lg} ${theme.space["2xl"]};
  border-top: 1px solid ${theme.color.gray100};
  text-align: center;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.placeholder};
`;
