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

/* 캐러셀 — 카드 + 좌우 화살표 (화살표는 카드 위에 겹쳐 띄움) */
export const FeaturedCarousel = styled.div`
  position: relative;
`;

export const CarouselArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "left: 1.6rem;" : "right: 1.6rem;")}
  transform: translateY(-50%);
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  color: ${theme.color.text};
  background: ${theme.color.white};
  border-radius: ${theme.radius.full};
  box-shadow: ${theme.shadow.md};
  transition: transform ${theme.transition.fast}, background ${theme.transition.fast};

  &:hover {
    background: ${theme.color.bgSoft};
    transform: translateY(-50%) scale(1.06);
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

/* 추천 카드 — 카드/이미지/본문 모두 높이를 명시적으로 고정한다.
   이미지 원본 비율이 뭐든( 세로/가로 상관없이 ) 이 박스를 cover 로 꽉 채운다 (레시피 사이트 표준).
   본문도 같은 높이로 고정하고 넘치면 잘라내 레이아웃이 안 무너지게 한다. */
const FEATURED_COL_W = "36rem";
const FEATURED_H = "26rem";

export const FeaturedCard = styled.div`
  display: grid;
  grid-template-columns: ${FEATURED_COL_W} 1fr;
  grid-template-rows: ${FEATURED_H}; /* 행 높이 고정 → 이미지가 세로여도 카드가 안 늘어남 */
  overflow: hidden;
  background: ${theme.color.bg};
  border: 1px solid ${theme.color.gray100};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
`;

export const FeaturedThumb = styled.div`
  width: 100%;
  height: ${FEATURED_H};
  overflow: hidden;
  background: ${theme.color.gray100};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 박스를 꽉 채우고 넘치는 부분만 크롭 */
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
  justify-content: safe center; /* 들어오면 가운데, 넘치면 위 기준(위가 안 잘리게) */
  gap: ${theme.space.sm};
  height: ${FEATURED_H};
  overflow: hidden;
  /* 오른쪽은 넘김 화살표가 겹치므로 여백을 더 준다 */
  padding: ${theme.space.xl} 6.4rem ${theme.space.xl} ${theme.space["3xl"]};
`;

/* 제목 위 작은 라벨 */
export const FeaturedEyebrow = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: 0.04em;
  color: ${theme.color.primary};
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
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.sub};
  background: ${theme.color.bgSoft};
  border-radius: ${theme.radius.sm};
`;

export const FeaturedSummary = styled.p`
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.base};
  color: ${theme.color.gray700};

  /* 2줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const FeaturedIngredient = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const FeaturedMeta = styled.div`
  display: flex;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
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

/* 조리법 등록 — 색 거의 없이 연하게. 얇은 테두리 + 옅은 배경, 펜 아이콘 */
export const RegisterButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  flex-shrink: 0;
  padding: ${theme.space.sm} ${theme.space.lg};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.gray700};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.sm};
  transition: background ${theme.transition.fast}, border-color ${theme.transition.fast},
    color ${theme.transition.fast};

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: ${theme.color.text};
    background: ${theme.color.bgSoft};
    border-color: ${theme.color.gray400};
  }
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

/* 내 알러지 자동 제외 on/off 토글 (회원 전용) — 정렬 토글 옆.
   좌우로 미끄러지는 스위치. 켜짐=연한 초록 / 꺼짐=연한 빨강, 상태 문구는 스위치 안에 */
export const AllergyToggle = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  padding: 0;
`;

/* 스위치 트랙 — radius·높이 를 정렬 토글/검색창과 맞춘다 */
export const AllergySwitch = styled.span`
  position: relative;
  display: block;
  width: 13rem;
  height: 3.9rem;
  border-radius: ${theme.radius.sm};
  background: ${({ $on }) =>
    $on ? theme.color.primary50 : theme.color.danger50};
  border: 1px solid
    ${({ $on }) => ($on ? theme.color.primary200 : theme.color.danger100)};
  transition: background ${theme.transition.base},
    border-color ${theme.transition.base};
`;

/* 스위치 안 상태 문구 — 가운데를 기준으로 손잡이 반대쪽으로 살짝만 치우친다.
   (예전엔 left↔right 로 왕복해서 글자가 너무 크게 움직였음 → 이동폭을 ±1rem 로 축소) */
export const AllergySwitchLabel = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
    translateX(${({ $on }) => ($on ? "-1rem" : "1rem")});
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  white-space: nowrap;
  color: ${({ $on }) =>
    $on ? theme.color.primary700 : theme.color.danger600};
  transition: transform ${theme.transition.base},
    color ${theme.transition.base};
`;

/* 좌우로 움직이는 손잡이 — 트랙과 같은 sm radius (둥근 사각형) */
export const AllergyKnob = styled.span`
  position: absolute;
  top: 0.3rem;
  bottom: 0.3rem;
  left: ${({ $on }) => ($on ? "calc(100% - 2.2rem - 0.3rem)" : "0.3rem")};
  width: 2.2rem;
  border-radius: ${theme.radius.sm};
  background: ${({ $on }) => ($on ? theme.color.primary : theme.color.danger)};
  box-shadow: ${theme.shadow.sm};
  transition: left ${theme.transition.base}, background ${theme.transition.base};
`;

/* 카테고리(왼쪽) + 구분선 + 프리셋(오른쪽) 을 한 줄에 놓는 래퍼 */
export const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xl};
`;

/* 후식 ↔ 프리셋 세로 구분선 — 타일 이모지 높이(6.4rem)에 맞춤 */
export const RowDivider = styled.span`
  flex-shrink: 0;
  align-self: center;
  width: 1px;
  height: 6.4rem;
  background: ${theme.color.gray200};
`;

/* 빠른 프리셋 — 이모지 타일 4개, 무조건 한 줄 (안 접힘). 공간 부족하면 카테고리 쪽이 스크롤됨 */
export const PresetGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  gap: ${theme.space.lg};
  margin-left: auto;
`;

/* 카테고리 타일과 완전히 같은 모양·크기 */
export const PresetTile = styled.button`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.xs};
`;

export const PresetThumb = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.4rem;
  height: 6.4rem;
  font-size: 2.8rem;
  line-height: 1;
  border-radius: ${theme.radius.sm};
  background: ${theme.color.bgSoft};
  border: 2px solid transparent;
  transition: border-color ${theme.transition.fast}, transform ${theme.transition.fast};

  ${PresetTile}[aria-pressed="true"] & {
    border-color: ${theme.color.primary};
  }

  ${PresetTile}:hover & {
    transform: translateY(-2px);
  }
`;

export const PresetLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.sub};

  ${PresetTile}[aria-pressed="true"] & {
    color: ${theme.color.primary};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

/* 카테고리 줄 — 왼쪽부터 쭉. 좁으면 스크롤은 되지만 스크롤바는 안 보이게 숨긴다 */
export const CategoryBar = styled.div`
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  gap: ${theme.space.lg};
  overflow-x: auto;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* 구 Edge/IE */
  &::-webkit-scrollbar {
    display: none; /* Chrome·Safari */
  }
`;

export const CategoryCard = styled.button`
  display: flex;
  flex-shrink: 0;
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
  width: 6.4rem;
  height: 6.4rem;
  font-size: 2.8rem;
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
