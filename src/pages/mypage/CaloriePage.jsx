import RaspSection from "./RaspSection";
import { CardWrap, PageBanner } from "./CaloriePage.styled";

/**
 * 마이페이지 — "소모 칼로리 측정" 탭. path: /mypage/calorie
 *
 * 만보기(라즈베리파이 걸음 수집기)를 계정에 연동하면 오늘/최근 7일 걸음 수와
 * 소모 칼로리(활동 + 기초대사량)를 볼 수 있다. 본문은 RaspSection 이 담당하고
 * 여기서는 다른 마이페이지 탭과 같은 카드 셸만 씌운다.
 */
function CaloriePage() {
  return (
    <CardWrap>
      <PageBanner />
      <RaspSection />
    </CardWrap>
  );
}

export default CaloriePage;
