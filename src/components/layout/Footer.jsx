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
            <BrandLogoIcon src="/favicon.svg" alt="" />
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
          주식회사 알러지아웃 | 대표자: 홍길동 | 서울시 마포구 월드컵북로 123
          <br />
          사업자등록번호: 120-00-00000 | 통신판매업신고번호: 제
          2026-서울마포-0000호
        </FooterBottomText>
        <FooterCopyright>
          allergy out © 2026. All rights reserved.
        </FooterCopyright>
      </FooterBottom>
    </FooterWrap>
  );
}

export default Footer;
