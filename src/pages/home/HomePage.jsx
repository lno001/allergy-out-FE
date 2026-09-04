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
  TextPanel,
} from "./HomePage.styled";

/** "/" 메인 페이지. 헤더/푸터는 Layout이 감싸서 그린다. */
function HomePage() {
  return (
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
  );
}

export default HomePage;
