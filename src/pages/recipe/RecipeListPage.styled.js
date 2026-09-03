import styled from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

/**
 * RecipeListPage 전용 styled 컴포넌트.
 * - 색·간격·폰트·radius·shadow 는 theme 토큰만 사용 (CLAUDE.md 2.[스타일]).
 * - border-width(1px), 그리드 최소폭(200px) 은 theme 토큰이 없어 리터럴 사용 — common.styled.js 와 동일 (B4).
 * - theme.media 토큰이 없어 반응형은 grid auto-fill 로만 처리 (B13).
 */

export const PageWrapper = styled.div`
  width: 100%;
  padding-block: ${theme.space["4xl"]};
`;

/* ---- 상단 툴바 ---- */

export const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${theme.space.lg};
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  margin-bottom: ${theme.space["2xl"]};
`;

/* 검색창 + "검색" 버튼을 한 줄로 묶는 form (엔터로도 submit 되게) */
export const SearchForm = styled.form`
  display: flex;
  flex: 1;
  gap: ${theme.space.sm};
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: ${theme.space.md} ${theme.space.xl};
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.full};

  &::placeholder {
    color: ${theme.color.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${theme.color.borderFocus};
  }
`;

/* ---- 적용된 필터 chip (제외 재료) ---- */

export const ActiveFilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.sm};
  margin-bottom: ${theme.space.xl};
`;

export const FilterChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  padding: ${theme.space.xs} ${theme.space.sm} ${theme.space.xs} ${theme.space.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.primary700};
  background: ${theme.color.primary50};
  border: 1px solid ${theme.color.primary200};
  border-radius: ${theme.radius.full};
`;

export const ChipRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.primary700};
  border-radius: ${theme.radius.full};
  transition: background ${theme.transition.fast};

  &:hover {
    background: ${theme.color.primary100};
  }
`;

/* ---- 목록 상태 영역 ---- */

export const ContentArea = styled.div`
  min-height: ${theme.space["6xl"]};
`;

export const RecipeGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.space.xl};

  /* 그리드 셀(li) 은 행 높이에 맞춰 늘어난다 → 카드가 그 높이를 채우게 함 */
  li {
    display: flex;
  }
`;

export const RecipeCard = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${theme.color.bg};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  transition: box-shadow ${theme.transition.base}, transform ${theme.transition.base};

  &:hover {
    box-shadow: ${theme.shadow.md};
    transform: translateY(-2px);
  }
`;

export const CardThumb = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  flex-shrink: 0; /* 세로 플렉스에서 눌리지 않게 */
  overflow: hidden; /* 이미지가 4:3 박스를 뚫고 나오지 않게 */
  background: ${theme.color.gray100}; /* 이미지 로드 실패 시 회색 박스 */

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex: 1; /* 남는 높이를 채워 카드 높이를 행 기준으로 통일 */
  flex-direction: column;
  gap: ${theme.space.sm};
  padding: ${theme.space.lg};
`;

export const CardTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  /* 제목 1줄 말줄임 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

/* ---- 빈 상태 ---- */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.lg};
  padding: ${theme.space["6xl"]} 0;
  color: ${theme.color.sub};
`;

export const EmptyText = styled.p`
  font-size: ${theme.fontSize.md};
`;

/* ---- 페이지네이션 ---- */

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.space["3xl"]};
`;
