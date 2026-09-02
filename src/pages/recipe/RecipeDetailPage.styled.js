import styled from "styled-components";

import { theme } from "../../styles/theme";

/**
 * RecipeDetailPage 전용 styled 컴포넌트.
 * - 색·간격·폰트·radius·shadow 는 theme 토큰만 사용 (CLAUDE.md 2.[스타일]).
 * - border-width(1px), 그리드 최소폭(220px)·이미지 최대폭(44rem) 은 theme 토큰이 없어 리터럴 사용 (B4).
 * - theme.media 토큰이 없어 Hero·재료 그리드는 auto-fill / 고정 비율로만 대응 (B13).
 */

export const PageWrapper = styled.div`
  width: 100%;
  padding-block: ${theme.space["3xl"]} ${theme.space["6xl"]};
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${theme.space.lg};
`;

export const BackButton = styled.button`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.text};
  }
`;

/* ---------------- Hero (대표 이미지 + 제목/팁/작성자) ---------------- */

export const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.space["3xl"]};
  align-items: start;
  margin-bottom: ${theme.space["4xl"]};
`;

export const HeroImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: ${theme.radius.lg};
  background: ${theme.color.gray100};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HeroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
`;

export const RecipeTitle = styled.h1`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.lineHeight.tight};
  color: ${theme.color.text};
`;

export const RecipeTip = styled.p`
  padding: ${theme.space.lg};
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.loose};
  color: ${theme.color.gray700};
  background: ${theme.color.primary50};
  border-radius: ${theme.radius.md};
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.space.lg};
  margin-top: auto;
  padding-top: ${theme.space.lg};
  border-top: 1px solid ${theme.color.gray100};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const Author = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const AuthorAvatar = styled.span`
  width: ${theme.space.xl};
  height: ${theme.space.xl};
  flex-shrink: 0;
  border-radius: ${theme.radius.full};
  background: ${theme.color.gray200};
`;

/* ---------------- 재료 (Hero 아래 전체폭) ---------------- */

export const MaterialSection = styled.section`
  margin-bottom: ${theme.space["5xl"]};
`;

export const SectionLabel = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.lg};
`;

export const MaterialList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  column-gap: ${theme.space["3xl"]};

  li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${theme.space.md};
    padding-block: ${theme.space.md};
    border-bottom: 1px solid ${theme.color.gray100};
  }
`;

export const MaterialName = styled.span`
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
`;

export const MaterialAmount = styled.span`
  flex-shrink: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

/* ---------------- 조리 순서 ---------------- */

export const StepsSection = styled.section`
  padding-top: ${theme.space["3xl"]};
  border-top: 1px solid ${theme.color.border};
`;

export const StepsHeading = styled.h2`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
  margin-bottom: ${theme.space["3xl"]};
`;

export const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${theme.space["4xl"]};
`;

export const StepItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
`;

/* 번호 + 설명을 한 줄에 */
export const StepHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.lg};
`;

export const StepNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${theme.space["4xl"]};
  height: ${theme.space["4xl"]};
  flex-shrink: 0;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.textOnPrimary};
  background: ${theme.color.primary};
  border-radius: ${theme.radius.full};
`;

export const StepText = styled.p`
  font-size: ${theme.fontSize.lg};
  line-height: ${theme.lineHeight.loose};
  color: ${theme.color.text};
`;

export const StepImage = styled.div`
  width: 100%;
  max-width: 44rem;
  aspect-ratio: 4 / 3;
  margin-left: calc(${theme.space["4xl"]} + ${theme.space.lg}); /* 번호 폭만큼 들여쓰기 */
  overflow: hidden;
  border-radius: ${theme.radius.lg};
  background: ${theme.color.gray100};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* ---------------- 하단 액션 (작성자용) ---------------- */

export const BottomActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.space.md};
  margin-top: ${theme.space["5xl"]};
`;

/* ---------------- 조회 실패 안내 (404 / 에러 공용) ---------------- */

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.lg};
  padding: ${theme.space["6xl"]} 0;
  color: ${theme.color.sub};
`;

export const MessageText = styled.p`
  font-size: ${theme.fontSize.md};
`;
