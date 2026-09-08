/**
 * 걸음 수 → 소모 칼로리 추정. 회원 DB에 키/몸무게를 안 두기로 해서(이번 범위 밖),
 * 키·몸무게는 사용자가 이 화면에서 직접 입력한 값(로컬 저장)만 쓴다 — 서버로 안 보냄.
 *
 * 계산 순서: 걸음 수 → 보폭(키 기반) → 이동 거리(km) → 소모 칼로리(체중 기반).
 * 보폭 = 키(cm) * 0.415 / 100 (걷기 보폭 추정에 흔히 쓰는 비율)
 * 소모 칼로리 = 이동 거리(km) * 체중(kg) * 0.9 (평지 걷기 기준 통상 추정치)
 */
export function calculateCaloriesBurned({ steps, heightCm, weightKg }) {
  if (!steps || !heightCm || !weightKg) return 0;
  const strideMeters = (heightCm * 0.415) / 100;
  const distanceKm = (steps * strideMeters) / 1000;
  const calories = distanceKm * weightKg * 0.9;
  return Math.round(calories);
}
