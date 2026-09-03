import styled from "styled-components";
import { Link } from "react-router-dom";

import { theme } from "../../styles/theme";

/**
 * RecipeListPage 전용 styled 컴포넌트 (1차 레이아웃).
 * - 색·간격·폰트·radius·shadow 는 theme 토큰만 사용 (CLAUDE.md 2.[스타일]).
 * - border-width(1px) 는 theme 토큰이 없어 리터럴 사용 — common.styled.js 와 동일 (B4).
 * - theme.media 토큰이 없어 반응형 breakpoint 는 생략, 그리드는 4열 고정 (B13).
 * - 헤더 높이(6xl=6.4rem)만큼 뺀 min-height 로 짧은 결과에서도 푸터가 안 올라오게 한다
 *   (공용 Layout 을 안 건드리는 임시 처리).
 */

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - ${theme.space["6xl"]});
  padding-block: ${theme.space["4xl"]};
`;

/* ============================================================
   오늘의 추천 레시피 — 큰 카드 1개 (예시 데이터)
   ============================================================ */

export const RecommendSection = styled.section`
  margin-bottom: ${theme.space["4xl"]};
`;

export const SectionHeading = styled.h2`
  margin-bottom: ${theme.space.lg};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

/* 캐러셀 — 카드 + 좌우 화살표 (화살표는 카드 위에 겹쳐 띄움) */
export const FeaturedCarousel = styled.div`
  position: relative;
`;

export const CarouselArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "left: 1.2rem;" : "right: 1.2rem;")}
  transform: translateY(-50%);
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  color: ${theme.color.text};
  background: ${theme.color.white};
  border-radius: ${theme.radius.sm};
  box-shadow: ${theme.shadow.sm};
  transition: background ${theme.transition.fast};

  &:hover {
    background: ${theme.color.bgSoft};
  }
`;

export const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.space.sm};
  margin-top: ${theme.space.md};
`;

export const CarouselDot = styled.button`
  width: ${({ $active }) => ($active ? "1.8rem" : "0.7rem")};
  height: 0.7rem;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) =>
    $active ? theme.color.primary : theme.color.gray300};
  transition: width ${theme.transition.fast}, background ${theme.transition.fast};
`;

/* 추천 카드 — 이미지가 카드 높이를 꽉 채우고, 본문은 세로 가운데 정렬해 여백을 줄인다 */
export const FeaturedCard = styled.div`
  display: grid;
  grid-template-columns: 30rem 1fr;
  min-height: 22rem;
  overflow: hidden;
  background: ${theme.color.bg};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.sm};
`;

export const FeaturedThumb = styled.div`
  height: 100%;
  background: ${theme.color.gray100};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FeaturedThumbFallback = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: ${theme.fontSize["3xl"]};
`;

export const FeaturedBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 가운데 → 아래쪽 빈 공간 제거 */
  gap: ${theme.space.md};
  /* 오른쪽은 넘김 화살표가 겹치므로 여백을 더 준다 */
  padding: ${theme.space["2xl"]} 6rem ${theme.space["2xl"]} ${theme.space["3xl"]};
`;

export const FeaturedTitle = styled.h3`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.lineHeight.tight};
  color: ${theme.color.text};
`;

export const FeaturedSpecRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
`;

export const FeaturedSpec = styled.span`
  padding: 0.3rem ${theme.space.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  background: ${theme.color.bgSoft};
  border-radius: ${theme.radius.sm};
`;

export const FeaturedSummary = styled.p`
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.base};
  color: ${theme.color.text};

  /* 2줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const FeaturedIngredient = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const FeaturedMeta = styled.div`
  display: flex;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};

  & > span:not(:last-child)::after {
    content: "·";
    margin-left: ${theme.space.xs};
  }
`;

/* ============================================================
   툴바
     1행: [필터] [최신순|인기순]  ...  [검색창] [조리법 등록하기]
     그 아래: 카테고리 — 이모지 타일 + 라벨 (나중에 대표 이미지로 교체)
   ============================================================ */

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  margin-bottom: ${theme.space["2xl"]};
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.space.lg};
`;

/* 왼쪽 묶음 — 필터 + 정렬 */
export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
`;

/* 오른쪽 묶음 — 검색창 + 조리법 등록 */
export const ToolbarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
`;

/* 최신순 / 인기순 세그먼트 토글 */
export const SortToggle = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  padding: ${theme.space.xs};
  background: ${theme.color.bgSoft};
  border-radius: ${theme.radius.sm};
`;

export const SortOption = styled.button`
  padding: ${theme.space.sm} ${theme.space.lg};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.sm};
  transition: background ${theme.transition.fast}, color ${theme.transition.fast};

  /* 선택된 정렬 기준 — 흰 배경 + 브랜드 컬러 */
  color: ${({ $active }) => ($active ? theme.color.primary : theme.color.sub)};
  background: ${({ $active }) => ($active ? theme.color.white : "transparent")};
  box-shadow: ${({ $active }) => ($active ? theme.shadow.sm : "none")};

  &:disabled {
    color: ${theme.color.gray400};
    cursor: not-allowed;
  }
`;

/* 카테고리 줄 — 가로 스크롤. 텍스트 전에 비주얼(이모지 타일)로 종류가 보이게 */
export const CategoryBar = styled.div`
  display: flex;
  gap: ${theme.space.md};
  overflow-x: auto;
  padding-bottom: ${theme.space.sm};
  scrollbar-width: thin;
`;

export const CategoryCard = styled.button`
  display: flex;
  flex: 1 1 0; /* 남는 폭을 고르게 나눠 가져서 타일이 줄 전체에 고르게 퍼지게 */
  min-width: 6.4rem;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.xs};
`;

/* 예시 비주얼 — 지금은 이모지, 나중에 대표 이미지 썸네일로 교체 */
export const CategoryThumb = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7.2rem;
  height: 7.2rem;
  font-size: 3rem;
  line-height: 1;
  border-radius: ${theme.radius.sm};
  background: ${({ $active }) => theme.color.bgSoft};
  border: 2px solid transparent;
  transition: border-color ${theme.transition.fast}, transform ${theme.transition.fast};

  ${CategoryCard}[aria-pressed="true"] & {
    border-color: ${theme.color.primary};
  }

  ${CategoryCard}:hover & {
    transform: translateY(-2px);
  }
`;

export const CategoryLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};

  ${CategoryCard}[aria-pressed="true"] & {
    color: ${theme.color.primary};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

/* 검색창 — 툴바 1행 오른쪽. 오른쪽 끝에 돋보기(submit) 버튼 */
export const SearchForm = styled.form`
  position: relative;
  display: flex;
  width: 24rem;
  max-width: 100%;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${theme.space.sm} 3.6rem ${theme.space.sm} ${theme.space.lg};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.sm};

  &::placeholder {
    color: ${theme.color.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${theme.color.borderFocus};
  }
`;

export const SearchSubmit = styled.button`
  position: absolute;
  right: 0.4rem;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  color: ${theme.color.sub};
  border-radius: ${theme.radius.sm};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.text};
  }
`;

/* ============================================================
   목록
   ============================================================ */

export const ContentArea = styled.div`
  min-height: ${theme.space["6xl"]};
`;

export const RecipeGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* 4열 균등 */
  gap: ${theme.space["2xl"]} ${theme.space.xl};

  li {
    display: flex;
    min-width: 0;
  }
`;

/* 카드 — 테두리 없이 이미지 위주, hover 시 살짝 떠오름 */
export const RecipeCard = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: transform ${theme.transition.base};

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${theme.radius.sm};
  background: ${theme.color.gray100};
  box-shadow: ${theme.shadow.sm};
  transition: box-shadow ${theme.transition.base};

  ${RecipeCard}:hover & {
    box-shadow: ${theme.shadow.lg};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${theme.space.xs};
  padding: ${theme.space.md} ${theme.space.xs} 0;
`;

export const CardTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  line-height: ${theme.lineHeight.tight};

  /* 2줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* 조리시간 · 난이도 (예시 데이터) */
export const CardSpecRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
`;

export const CardSpec = styled.span`
  padding: 0.2rem ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  background: ${theme.color.bgSoft};
  border-radius: ${theme.radius.sm};
`;

/* 난이도 — 쉬움/보통/어려움에 따라 색을 다르게 */
const DIFFICULTY_COLORS = {
  쉬움: { fg: theme.color.primary700, bg: theme.color.primary50 },
  보통: { fg: theme.color.caution600, bg: theme.color.caution50 },
  어려움: { fg: theme.color.danger600, bg: theme.color.danger50 },
};

export const CardDifficulty = styled.span`
  padding: 0.2rem ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.sm};
  color: ${({ $level }) =>
    (DIFFICULTY_COLORS[$level] ?? DIFFICULTY_COLORS.보통).fg};
  background: ${({ $level }) =>
    (DIFFICULTY_COLORS[$level] ?? DIFFICULTY_COLORS.보통).bg};
`;

/* 주재료 (예시 데이터) — 한 줄, 넘치면 말줄임 */
export const CardMainIngredient = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  margin-top: auto;
  padding-top: ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};

  /* 작성자와 날짜 사이 가운뎃점 */
  & > span:not(:last-child)::after {
    content: "·";
    margin-left: ${theme.space.xs};
  }
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
