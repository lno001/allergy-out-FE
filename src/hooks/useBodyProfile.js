import { useEffect, useState } from "react";

const STORAGE_KEY = "allergyout.bodyProfile";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * 칼로리 계산에만 쓰는 키/몸무게. 회원 DB에 저장하는 값이 아니라(이번 범위 밖),
 * 이 브라우저에만 남는 localStorage에 보관한다 — 기기·브라우저를 바꾸면 다시 입력해야 함.
 */
export function useBodyProfile() {
  const [heightCm, setHeightCmState] = useState(() => readStored().heightCm ?? "");
  const [weightKg, setWeightKgState] = useState(() => readStored().weightKg ?? "");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ heightCm, weightKg }));
    } catch {
      // localStorage를 못 쓰는 환경(시크릿 모드 등)이면 그냥 이번 세션에서만 씀
    }
  }, [heightCm, weightKg]);

  return {
    heightCm,
    weightKg,
    setHeightCm: setHeightCmState,
    setWeightKg: setWeightKgState,
  };
}
