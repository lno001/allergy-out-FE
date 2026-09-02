import styled from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.header};
  border-top: 4px solid ${theme.color.primary};
  border-bottom: 1px solid ${theme.color.gray100};
  background-color: ${theme.color.bg};
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${theme.space["6xl"]};
  padding-inline: ${theme.space["3xl"]};
`;

export const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const LogoIcon = styled.img`
  width: ${theme.space["3xl"]};
  height: ${theme.space["3xl"]};
`;

export const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: ${theme.lineHeight.tight};
`;

export const LogoTextMain = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const LogoTextSub = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.sub};
  letter-spacing: 0.05em;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.space.xl};
`;

export const NavItem = styled(Link)`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.primaryHover};
  }
`;

export const UserBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const UserName = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
  white-space: nowrap;
`;

export const LogoutButton = styled.button`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.danger};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.dangerHover};
  }
`;
