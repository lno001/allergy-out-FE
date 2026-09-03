import styled from "styled-components";

import { theme } from "../../styles/theme";

/**
 * RecipeListPage 의 "재료 필터" 모달 전용 styled 컴포넌트.
 * - 공통 Modal(껍데기)의 본문으로 들어간다. 좌: 분류(key) 네비 / 우: 재료(value) 체크박스.
 * - 색·간격·radius 는 theme 토큰만 사용. border-width(1px) 는 토큰이 없어 리터럴 (common.styled 와 동일, B4).
 * - theme.media 토큰이 없어 좁은 화면 대응은 생략 — 모달 최대폭(lg 680px) 안에서 2단 고정.
 */

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 196px 1fr;
  min-height: 320px;
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

/* ---- 좌: 분류(key) 목록 ---- */

export const KeyList = styled.ul`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme.color.border};
  background: ${theme.color.gray50};
  overflow-y: auto;
  max-height: 52vh;
`;

/* 분류 한 줄: [분류 전체선택 체크박스] + [오른쪽 목록 전환 버튼] */
export const KeyRow = styled.li`
  display: flex;
  align-items: stretch;
  background: ${({ $active }) => ($active ? theme.color.white : "transparent")};
  border-left: 2px solid
    ${({ $active }) => ($active ? theme.color.primary : "transparent")};
  transition: background ${theme.transition.fast};

  &:hover {
    background: ${theme.color.white};
  }
`;

/* 분류 전체선택 체크박스 영역 — 클릭 타깃 확보용 패딩 */
export const KeyCheckboxWrap = styled.label`
  display: flex;
  align-items: center;
  padding-left: ${theme.space.md};

  input {
    width: 16px;
    height: 16px;
    accent-color: ${theme.color.primary};
    cursor: pointer;
  }
`;

/* 오른쪽 재료 목록으로 전환하는 버튼 (선택 X, 네비게이션 전용) */
export const KeyNavButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  padding: ${theme.space.md} ${theme.space.lg} ${theme.space.md} ${theme.space.sm};
  font-size: ${theme.fontSize.sm};
  font-weight: ${({ $active }) =>
    $active ? theme.fontWeight.semibold : theme.fontWeight.regular};
  color: ${({ $active }) => ($active ? theme.color.primary : theme.color.text)};
  transition: color ${theme.transition.fast};
`;

/* 그 분류에서 선택된 재료 수 (0 이면 숨김) */
export const KeyBadge = styled.span`
  flex-shrink: 0;
  min-width: 18px;
  padding: 0 ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  line-height: 18px;
  text-align: center;
  color: ${theme.color.textOnPrimary};
  background: ${theme.color.primary};
  border-radius: ${theme.radius.full};
`;

/* ---- 우: 재료(value) 체크박스 ---- */

export const ValuePanel = styled.div`
  padding: ${theme.space.lg};
  overflow-y: auto;
  max-height: 52vh;
`;

export const ValuePanelTitle = styled.p`
  margin-bottom: ${theme.space.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.sub};
`;

export const ValueList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.space.xs} ${theme.space.md};
`;

export const ValueLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
  border-radius: ${theme.radius.sm};
  cursor: pointer;

  &:hover {
    background: ${theme.color.bgSoft};
  }

  input {
    width: 16px;
    height: 16px;
    accent-color: ${theme.color.primary};
    cursor: pointer;
  }
`;

/* ---- 하단: 선택 요약 ---- */

export const SelectionSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  margin-top: ${theme.space.lg};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const ClearButton = styled.button`
  flex-shrink: 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  text-decoration: underline;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.text};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: none;
  }
`;
