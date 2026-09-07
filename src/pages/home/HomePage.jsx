import { useEffect, useMemo, useState } from "react";

import { getFilteredRecipes } from "../../apis/recipeApi";
import bibimbapImg from "../../assets/home/bibimbap.jpg";
import chickenImg from "../../assets/home/chicken.jpg";
import saladImg from "../../assets/home/salad.jpg";
import steakImg from "../../assets/home/steak.jpg";
import { useAuth } from "../../hooks/useAuth";
import {
  Heading,
  HeroGrid,
  HeroSection,
  Paragraph,
  PhotoArrowBtn,
  PhotoLink,
  PhotoOverlay,
  PhotoPanel,
  PhotoTile,
  PhotoTrack,
  PhotoViewport,
  RotatingImg,
  ShortcutButton,
  ShortcutLink,
  ShortcutRow,
  TextPanel,
} from "./HomePage.styled";

/** 실제 등록된 레시피 사진을 못 받아왔을 때(초기 로딩 중, API 실패, 대표 이미지 있는
 *  레시피가 하나도 없음) 보여줄 기본 사진 4장. */
const DEFAULT_PHOTOS = [
  { src: saladImg, alt: "알러지 걱정 없는 샐러드 레시피" },
  { src: bibimbapImg, alt: "알러지 걱정 없는 비빔밥 레시피" },
  { src: chickenImg, alt: "알러지 걱정 없는 치킨 레시피" },
  { src: steakImg, alt: "알러지 걱정 없는 스테이크 레시피" },
];

const RANDOM_POOL_SIZE = 20; // 이 중에서 랜덤으로 뽑아 쓴다 (page=0, size=RANDOM_POOL_SIZE)
const MAX_CAROUSEL_PHOTOS = 8; // 너무 많아지지 않게 랜덤으로 뽑은 것 중 최대 이만큼만 사용
const REFRESH_INTERVAL_MS = 60_000; // 이 주기로 다시 가져와서 랜덤으로 갱신

/** 배열을 제자리에서 무작위로 섞는다(Fisher–Yates) */
function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TILE_SIZE = 24; // rem, 가운데(활성) 사진의 크기
// PhotoTrack의 실제 CSS gap(theme.space.lg = 1.6rem)과 반드시 같아야
// 가운데 사진이 정확히 뷰포트 중앙에 온다 — 값이 안 맞으면 옆으로 밀려서 잘려 보인다.
const TILE_GAP = 1.6;
const VIEWPORT_SIZE = 34; // rem, PhotoViewport 크기와 맞춤 — 클수록 옆 사진이 더 많이 비쳐 보임
const STEP = TILE_SIZE + TILE_GAP;
// 한 바퀴(사진 전체 개수)를 이 정도 반복해서 이어붙여야 화살표/자동 전환을 계속해도
// 끝에 닿아 1번으로 튀어 돌아가는 일이 실사용에서 사실상 없다.
const MIN_LOOPED_LENGTH = 160;

/** 좌/우 화살표 아이콘 (dir: "prev" | "next") */
function ChevronIcon({ dir }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "prev" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

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
  const { isReady } = useAuth(); // 토큰 재발급 부트스트랩 완료 후 조회해야 로그인 회원 알러지 제외가 반영됨
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS);

  // 진입 시 + 이후 1분마다 실제 등록된 레시피 중 대표 이미지가 있는 것들을 가져와
  // 랜덤으로 다시 섞는다. 새로고침 안 해도 새로 등록된 레시피가 후보에 들어오고,
  // 뽑히는 조합도 주기적으로 바뀐다. 실패하거나 이미지 있는 레시피가 하나도 없으면
  // 그 순간의 photos(처음엔 DEFAULT_PHOTOS)를 그대로 둔다.
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    const fetchAndShuffle = async () => {
      try {
        const res = await getFilteredRecipes({ page: 0, size: RANDOM_POOL_SIZE });
        const recipes = res?.data?.recipes ?? [];
        const withImage = recipes
          .filter((r) => r.recipesImgPath)
          .map((r) => ({
            src: r.recipesImgPath,
            alt: r.recipeTitle,
            recipeNo: r.recipeNo,
          }));
        if (!cancelled && withImage.length > 0) {
          setPhotos(shuffle(withImage).slice(0, MAX_CAROUSEL_PHOTOS));
        }
      } catch {
        // 홈 화면 장식용이라 실패해도 지금까지 보여주던 사진을 그대로 유지한다.
      }
    };

    fetchAndShuffle();
    const intervalId = setInterval(fetchAndShuffle, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [isReady]);

  // photos가 바뀔 때마다(기본 4장 → 실제 레시피로 교체) 다시 계산한다.
  const { loopedPhotos, startPos } = useMemo(() => {
    const loopCount = Math.max(3, Math.ceil(MIN_LOOPED_LENGTH / photos.length));
    return {
      loopedPhotos: Array.from(
        { length: photos.length * loopCount },
        (_, i) => photos[i % photos.length],
      ),
      startPos: Math.floor(loopCount / 2) * photos.length,
    };
  }, [photos]);

  // 가운데 놓을 위치. 절대 되돌아가지 않고 화살표/자동 전환 방향으로만 계속
  // 늘어나거나(다음) 줄어든다(이전) — 그래서 자연스럽게 이어진다.
  const [centerPos, setCenterPos] = useState(startPos);

  // photos 자체가 바뀌면(기본 사진 → 실제 레시피 로딩 완료) 그 목록 기준 가운데로 되돌린다.
  useEffect(() => {
    setCenterPos(startPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopedPhotos]);

  const move = (step) =>
    setCenterPos((p) => Math.min(Math.max(p + step, 0), loopedPhotos.length - 1));

  useEffect(() => {
    const timerId = setTimeout(() => move(1), 5000);
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerPos]);

  const offsetRem = VIEWPORT_SIZE / 2 - TILE_SIZE / 2 - centerPos * STEP;

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
            <PhotoArrowBtn
              type="button"
              aria-label="이전 사진"
              onClick={() => move(-1)}
            >
              <ChevronIcon dir="prev" />
            </PhotoArrowBtn>

            <PhotoViewport>
              <PhotoTrack $offsetRem={offsetRem}>
                {loopedPhotos.map((photo, pos) => {
                  const active = pos === centerPos;
                  const image = (
                    <>
                      <RotatingImg
                        src={photo.src}
                        alt={photo.alt}
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                      {/* 가운데(선택된) 사진은 선명하게 그대로 두고, 옆으로 비쳐 보이는
                          사진에만 그라데이션을 씌워 시선이 가운데로 모이게 한다. */}
                      {!active && <PhotoOverlay />}
                    </>
                  );
                  return (
                    <PhotoTile key={pos} $size={TILE_SIZE} $active={active}>
                      {/* 실제 등록된 레시피(recipeNo 있음)의 가운데 사진만 클릭해서
                          상세 페이지로 이동할 수 있게 한다. */}
                      {active && photo.recipeNo ? (
                        <PhotoLink to={`/recipe/${photo.recipeNo}`}>
                          {image}
                        </PhotoLink>
                      ) : (
                        image
                      )}
                    </PhotoTile>
                  );
                })}
              </PhotoTrack>
            </PhotoViewport>

            <PhotoArrowBtn
              type="button"
              aria-label="다음 사진"
              onClick={() => move(1)}
            >
              <ChevronIcon dir="next" />
            </PhotoArrowBtn>
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
