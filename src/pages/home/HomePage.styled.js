import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { theme } from "../../styles/theme";

export const HeroSection = styled.section`
  padding: ${theme.space["3xl"]};
  display: flex;
  justify-content: center;
`;

export const HeroGrid = styled.div`
  max-width: 118rem;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  border-radius: ${theme.radius.lg};
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const TextPanel = styled.div`
  background-color: ${theme.color.bgSoft};
  padding: ${theme.space["4xl"]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.space.xl};
`;

export const Heading = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const Paragraph = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.md};
  line-height: ${theme.lineHeight.loose};
  color: ${theme.color.text};
  font-weight: ${theme.fontWeight.semibold};
`;

/* 가운데 사진 하나는 크게, 좌/우 사진은 옆으로 살짝 비쳐 보이는(peek) 우측 패널.
   화살표는 잘리는 뷰포트 바깥 좌/우에 둬서 사진을 가리지 않는다. */
export const PhotoPanel = styled.div`
  position: relative;
  background-color: ${theme.color.bgPage};
  min-height: 44rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.lg};
  padding: 0 ${theme.space.lg};
`;

/* 가운데 사진 + 양옆 살짝 비치는 사진만 남기고 나머지는 잘라내는 창 */
export const PhotoViewport = styled.div`
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  width: 34rem;
  height: 34rem;
`;

/* 사진들을 한 줄로 늘어놓고 $offset만큼 옆으로 밀어서 원하는 사진이 가운데 오게 한다 */
export const PhotoTrack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: ${theme.space.lg};
  height: 100%;
  transform: translateX(${({ $offsetRem }) => $offsetRem}rem);
  transition: transform 0.5s ease;
`;

export const PhotoTile = styled.div`
  position: relative;
  flex: 0 0 ${({ $size }) => $size}rem;
  height: 100%;
  border-radius: ${theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ $active }) => ($active ? theme.shadow.lg : "none")};
  border: ${({ $active }) => ($active ? `4px solid ${theme.color.white}` : "none")};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  transition: opacity 0.5s ease;
`;

/* 실제 등록된 레시피 사진(가운데 활성 칸)을 눌렀을 때 상세 페이지로 보내는 링크 —
   칸 전체를 덮어서 사진 어디를 눌러도 이동한다. */
export const PhotoLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export const RotatingImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/* 브랜드 그린 톤 그라데이션 — 사진이 바뀌어도 톤이 항상 통일되게. */
export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(31, 138, 82, 0) 45%,
    rgba(15, 79, 48, 0.55) 100%
  );
`;

/* 좌/우 화살표 — 그리드 바깥에 나란히 두는 일반 플렉스 아이템이라 사진을 가리지 않는다. */
export const PhotoArrowBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  color: ${theme.color.text};
  background: ${theme.color.white};
  border-radius: ${theme.radius.full};
  box-shadow: ${theme.shadow.md};
  transition: transform ${theme.transition.fast}, background ${theme.transition.fast};

  &:hover {
    background: ${theme.color.bgSoft};
    transform: scale(1.06);
  }
`;

/* 히어로 아래, 3개의 바로가기 버튼(알약 모양 아웃라인) 줄 */
export const ShortcutRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${theme.space["2xl"]};
  padding: ${theme.space["5xl"]} ${theme.space["3xl"]} ${theme.space["4xl"]};
`;

/* 색은 공용 Button의 primary("레시피 등록하기"와 동일)를 그대로 맞춘다. */
const shortcutBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
  height: 7.2rem;
  padding: 0 ${theme.space["3xl"]};
  border-radius: ${theme.radius.full};
  border: none;
  background-color: ${theme.color.primary};
  color: ${theme.color.textOnPrimary};
  box-shadow: ${theme.shadow.primary};
  font-size: 2.08rem;
  font-weight: ${theme.fontWeight.semibold};
  white-space: nowrap;
  transition: background-color ${theme.transition.base}, box-shadow ${theme.transition.base},
    transform ${theme.transition.base};

  svg {
    width: 2.4rem;
    height: 2.4rem;
    flex-shrink: 0;
  }
`;

export const ShortcutLink = styled(Link)`
  ${shortcutBase}

  &:hover {
    background-color: ${theme.color.primaryHover};
    box-shadow: ${theme.shadow.primaryHover};
    transform: translateY(-1px);
  }
`;

/* 아직 갈 페이지가 없는 바로가기(내 작성 레시피) — 색은 같이 맞추되 비활성임을 옅게 표시 */
export const ShortcutButton = styled.button`
  ${shortcutBase}
  cursor: not-allowed;
  opacity: 0.55;
`;
