import { useEffect, useState } from "react";

import { getDailySteps, getTodaySteps } from "../apis/raspApi";

/** 최근 7일 날짜 배열(오늘 포함, 오름차순) — "YYYY-MM-DD" */
function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/**
 * 마이페이지 "라즈베리파이 연동" 섹션의 걸음 대시보드(오늘 추이 + 최근 7일) 상태.
 * 실제로 연결 가능한 건 팀의 데모 기기 하나뿐이라 개인별 등록 여부는 따지지 않고,
 * 그냥 조회해서 404(DEVICE_NOT_FOUND)면 "아직 데모 기기가 연동되지 않음"으로 다룬다.
 *
 * @returns {{
 *   points: { time: string, steps: number }[],
 *   days: { date: string, steps: number }[],
 *   isLoading: boolean,
 *   isConnected: boolean,
 *   error: string|null,
 * }}
 */
export function useStepsDashboard() {
  const [points, setPoints] = useState([]);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    Promise.all([getTodaySteps(), getDailySteps()])
      .then(([todayRes, dailyRes]) => {
        if (ignore) return;
        setIsConnected(true);
        setPoints(todayRes.data?.points ?? []);

        // 문서 규칙: 데이터 없는 날은 응답에서 생략되므로, 프론트가 최근 7일 축을 직접 만들고
        // 없는 날짜는 0으로 채운다.
        const byDate = new Map(
          (dailyRes.data?.days ?? []).map((d) => [d.date, d.steps]),
        );
        setDays(last7Days().map((date) => ({ date, steps: byDate.get(date) ?? 0 })));
      })
      .catch((err) => {
        if (ignore) return;
        if (err.code === 404) {
          setIsConnected(false); // 데모 기기가 아직 세팅 전 — 정상 상태
        } else {
          setError(err.msg ?? "걸음 데이터를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { points, days, isLoading, isConnected, error };
}
