import styled, { css } from "styled-components";

import { theme } from "../../styles/theme";

export const FooterWrap = styled.footer`
  background-color: ${theme.color.bgPage};
  border-top: 1px solid ${theme.color.gray100};
`;

export const FooterInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space["5xl"]};
  padding: ${theme.space["4xl"]} ${theme.space["3xl"]};
`;

export const BrandColumn = styled.div`
  flex: 2 1 32rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const BrandLogo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const BrandLogoIcon = styled.img`
  width: ${theme.space["3xl"]};
  height: ${theme.space["3xl"]};
`;

export const BrandLogoText = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

/* max-width는 theme 간격 스케일(최대 6.4rem)로 표현할 수 없는 문단 폭 제한값.
   common.styled.js의 ModalBox 사이즈(400/500/680px)와 같은 이유로 예외 허용. */
export const BrandDescription = styled.p`
  max-width: 42rem;
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.loose};
  color: ${theme.color.sub};
`;

export const FooterColumn = styled.div`
  flex: 1 1 16rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const FooterColumnTitle = styled.h3`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

/* 지금은 안내/약관 항목을 일반 텍스트로만 둔다. 어떤 페이지로 연결할지 팀 합의가
   끝나면 styled(Link) 로 바꾸고 to 를 채운다 (레이아웃은 그대로). */
export const FooterItem = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};

  ${({ $emphasis }) =>
    $emphasis &&
    css`
      color: ${theme.color.text};
      font-weight: ${theme.fontWeight.semibold};
    `}
`;

export const FooterBottom = styled.div`
  border-top: 1px solid ${theme.color.gray100};
  padding: ${theme.space.xl} ${theme.space["3xl"]};
`;

export const FooterBottomText = styled.p`
  font-size: ${theme.fontSize.xs};
  line-height: ${theme.lineHeight.base};
  color: ${theme.color.sub};
`;

export const FooterCopyright = styled.p`
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;
