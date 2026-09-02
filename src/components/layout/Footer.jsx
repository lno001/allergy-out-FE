import {
  BrandColumn,
  BrandDescription,
  BrandLogo,
  BrandLogoIcon,
  BrandLogoText,
  FooterBottom,
  FooterBottomText,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterWrap,
  LinkColumn,
  LinkColumnTitle,
} from "./Footer.styled";

/**
 * 서비스 공통 푸터. 로그인 상태와 무관하게 항상 동일하게 렌더링된다.
 *
 * 서비스 안내/약관 링크가 가리키는 페이지(서비스 소개, 사용방법, 공지사항,
 * 이용약관, 개인정보처리방침)는 아직 CLAUDE.md 화면 범위에 없다 — 링크 UI만
 * 구현했고 실제 페이지는 없다 (경로 들어가면 임시로 Preview로 빠짐).
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
            제공하여, 모든 분들이 걱정 없이 맛있는 한 끼 식사를 누릴 수
            있도록 돕는 혁신적인 스마트 헬스케어 서비스입니다.
          </BrandDescription>
        </BrandColumn>

        <LinkColumn>
          <LinkColumnTitle>서비스 안내</LinkColumnTitle>
          <FooterLink to="/service-intro">서비스 소개</FooterLink>
          <FooterLink to="/how-to-use">사용방법</FooterLink>
          <FooterLink to="/notice">공지사항</FooterLink>
        </LinkColumn>

        <LinkColumn>
          <LinkColumnTitle>약관 및 정책</LinkColumnTitle>
          <FooterLink to="/terms">이용약관</FooterLink>
          <FooterLink to="/privacy" $emphasis>
            개인정보처리방침
          </FooterLink>
        </LinkColumn>
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
