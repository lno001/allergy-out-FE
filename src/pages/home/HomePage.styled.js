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

/* 사진 3장이 뜨는 우측 패널. 사진은 절대좌표로 삼각형(위 1장 + 아래 2장) 구도로 배치. */
export const PhotoPanel = styled.div`
  position: relative;
  background-color: ${theme.color.bgPage};
  min-height: 40rem;
`;

const photoCardBase = css`
  position: absolute;
  width: 42%;
  aspect-ratio: 1 / 1;
  border-radius: ${theme.radius.md};
  overflow: hidden;
  box-shadow: ${theme.shadow.md};
  border: 4px solid ${theme.color.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const PhotoTop = styled.div`
  ${photoCardBase}
  top: ${theme.space["2xl"]};
  left: 50%;
  transform: translateX(-50%);
`;

export const PhotoBottomLeft = styled.div`
  ${photoCardBase}
  bottom: ${theme.space["2xl"]};
  left: 6%;
`;

export const PhotoBottomRight = styled.div`
  ${photoCardBase}
  bottom: ${theme.space["2xl"]};
  right: 6%;
`;

/* 브랜드 그린 톤 그라데이션 — 사진 3장이 한 세트처럼 보이도록 통일감을 준다. */
export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(31, 138, 82, 0) 45%,
    rgba(15, 79, 48, 0.55) 100%
  );
`;
