import bibimbapImg from "../../assets/home/bibimbap.jpg";
import chickenImg from "../../assets/home/chicken.jpg";
import saladImg from "../../assets/home/salad.jpg";
import {
  Heading,
  HeroGrid,
  HeroSection,
  Paragraph,
  PhotoBottomLeft,
  PhotoBottomRight,
  PhotoOverlay,
  PhotoPanel,
  PhotoTop,
  ShortcutButton,
  ShortcutLink,
  ShortcutRow,
  TextPanel,
} from "./HomePage.styled";

/** 바로가기 아이콘 — 사각형(문) + 화살표. stroke="currentColor"라 버튼 색을 그대로 따라간다. */
function ShortcutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/** "/" 메인 페이지. 헤더/푸터는 Layout이 감싸서 그린다. */
function HomePage() {
  return (
    <>
      <HeroSection>
        <HeroGrid>
          <TextPanel>
            <Heading>알러지 아웃 사이트란?</Heading>
            <Paragraph>
              알러지 반응으로 인해 먹을 수 있는 음식 레시피를 찾기 어려운
              사람들을 위해 만든 사이트입니다.
            </Paragraph>
            <Paragraph>
              이곳에서 자신 또는 요리를 해주고 싶은 사람과 알러지 걱정 없는
              레시피를 찾아보세요.
            </Paragraph>
          </TextPanel>

          <PhotoPanel>
            <PhotoTop>
              <img src={saladImg} alt="알러지 걱정 없는 샐러드 레시피" />
              <PhotoOverlay />
            </PhotoTop>
            <PhotoBottomLeft>
              <img src={bibimbapImg} alt="알러지 걱정 없는 비빔밥 레시피" />
              <PhotoOverlay />
            </PhotoBottomLeft>
            <PhotoBottomRight>
              <img src={chickenImg} alt="알러지 걱정 없는 치킨 레시피" />
              <PhotoOverlay />
            </PhotoBottomRight>
          </PhotoPanel>
        </HeroGrid>
      </HeroSection>

      <ShortcutRow>
        <ShortcutLink to="/recipe">
          <ShortcutIcon />
          오늘의 추천 레시피 바로가기
        </ShortcutLink>
        <ShortcutLink to="/mypage/bookmark">
          <ShortcutIcon />
          즐겨찾는 레시피 바로가기
        </ShortcutLink>
        <ShortcutButton
          type="button"
          disabled
          title="내 작성 레시피 페이지는 준비 중입니다"
        >
          <ShortcutIcon />
          내 작성 레시피 바로가기
        </ShortcutButton>
      </ShortcutRow>
    </>
  );
}

export default HomePage;
