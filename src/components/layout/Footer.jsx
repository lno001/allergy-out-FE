import {
  BrandColumn,
  BrandDescription,
  BrandLogo,
  BrandLogoIcon,
  BrandLogoText,
  FooterBottom,
  FooterBottomText,
  FooterColumn,
  FooterColumnTitle,
  FooterCopyright,
  FooterInner,
  FooterItem,
  FooterWrap,
} from "./Footer.styled";

/**
 * 서비스 공통 푸터. 로그인 상태와 무관하게 항상 동일하게 렌더링된다.
 *
 * 안내/약관 항목은 지금은 레이아웃(모양)만 잡아둔 일반 텍스트다 — 각 항목이 어떤
 * 페이지로 연결될지 팀 합의가 끝나면 Footer.styled.js 의 FooterItem 을 styled(Link) 로
 * 바꾸고 여기에 to 를 채운다.
 */
function Footer() {
  return (
    <FooterWrap>
      <FooterInner>
        <BrandColumn>
          <BrandLogo>
            <BrandLogoIcon src="/favicon.png" alt="" />
            <BrandLogoText>알러지 아웃</BrandLogoText>
          </BrandLogo>
          <BrandDescription>
            음식 알레르기 정보를 관리하고 안전한 개인 맞춤형 레시피를 손쉽게
            제공하여, 모든 분들이 걱정 없이 맛있는 한 끼 식사를 누릴 수 있도록
            돕는 혁신적인 스마트 헬스케어 서비스입니다.
          </BrandDescription>
        </BrandColumn>

        <FooterColumn>
          <FooterColumnTitle>서비스 안내</FooterColumnTitle>
          <FooterItem>서비스 소개</FooterItem>
          <FooterItem>사용방법</FooterItem>
          <FooterItem>공지사항</FooterItem>
        </FooterColumn>

        <FooterColumn>
          <FooterColumnTitle>약관 및 정책</FooterColumnTitle>
          <FooterItem>이용약관</FooterItem>
          <FooterItem>개인정보처리방침</FooterItem>
        </FooterColumn>
      </FooterInner>

      <FooterBottom>
        <FooterBottomText>
          일부 레시피는 식품의약품안전처 「조리식품의 레시피 DB」를 활용해
          <br />
          사이트에 맞게 가공한 것입니다.
        </FooterBottomText>
        <FooterCopyright>
          allergy out © 2026. All rights reserved.
        </FooterCopyright>
      </FooterBottom>
    </FooterWrap>
  );
}

export default Footer;
