import { useEffect, useState } from "react";

import { getDailySteps, getTodaySteps } from "../apis/raspApi";

/** Date → "YYYY-MM-DD" (로컬 기준). toISOString()은 UTC로 바꿔서 자정~오전 시간대에 하루 밀림 */
function toLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 최근 7일 날짜 배열(오늘 포함, 오름차순) — "YYYY-MM-DD" */
function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toLocalDateString(d));
  }
  return days;
}

/**
 * 마이페이지 "라즈베리파이 연동" 섹션의 걸음 대시보드(오늘 추이 + 최근 7일) 상태.
 * 디바이스가 등록된 뒤에만 의미가 있으므로, enabled=false면 아무것도 호출하지 않는다
 * (미등록 상태에서 굳이 또 404를 받아올 필요가 없음 — useDevice가 이미 그 정보를 앎).
 *
 * @param {boolean} enabled
 * @returns {{
 *   points: { createDate: string, steps: number }[],
 *   days: { date: string, steps: number }[],
 *   isLoading: boolean,
 *   error: string|null,
 * }}
 */
export function useStepsDashboard(enabled) {
  const [points, setPoints] = useState([]);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    let ignore = false;
    setIsLoading(true);
    setError(null);

    Promise.all([getTodaySteps(), getDailySteps()])
      .then(([todayRes, dailyRes]) => {
        if (ignore) return;
        setPoints(todayRes.data?.points ?? []);

        // 문서 규칙: 데이터 없는 날은 응답에서 생략되므로, 프론트가 최근 7일 축을 직접 만들고
        // 없는 날짜는 0으로 채운다.
        const byDate = new Map(
          (dailyRes.data?.days ?? []).map((d) => [d.stepDate, d.steps]),
        );
        setDays(last7Days().map((date) => ({ date, steps: byDate.get(date) ?? 0 })));
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.msg ?? "걸음 데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [enabled]);

  return { points, days, isLoading, error };
}
