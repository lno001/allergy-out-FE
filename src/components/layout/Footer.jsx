import Button from "../common/Button";
import {
  FooterBrand,
  FooterColumn,
  FooterColumnTitle,
  FooterColumns,
  FooterContactCard,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterWrapper,
} from "./layout.styled";

/**
 * 사이트 공통 푸터. 링크는 아직 실제 페이지가 없는 것도 있어 href="#"로 자리만 잡아둡니다.
 */
function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterBrand>🛡️ Allergy Out</FooterBrand>

        <FooterColumns>
          <FooterColumn>
            <FooterColumnTitle>서비스</FooterColumnTitle>
            <FooterLink href="#">서비스 소개</FooterLink>
            <FooterLink href="#">이용약관</FooterLink>
            <FooterLink href="#">개인정보처리방침</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterColumnTitle>고객센터</FooterColumnTitle>
            <FooterLink href="#">자주 묻는 질문</FooterLink>
            <FooterLink href="#">문의하기</FooterLink>
          </FooterColumn>
        </FooterColumns>

        <FooterContactCard>
          <strong>궁금한 점이 있으신가요?</strong>
          <Button variant="ghost" size="sm">문의하기 →</Button>
        </FooterContactCard>
      </FooterInner>

      <FooterCopyright>ⓒ 2026 Allergy Out. All rights reserved.</FooterCopyright>
    </FooterWrapper>
  );
}

export default Footer;
