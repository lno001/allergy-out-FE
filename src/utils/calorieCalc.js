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

/**
 * 기초대사량(BMR) 간이 추정. 표준 공식(Mifflin-St Jeor 등)은 나이·성별까지 필요한데
 * 이 화면은 키·몸무게만 받으므로, 체중 1kg당 시간당 약 1kcal라는 통상적인 어림값을 써서
 * 체중(kg) × 24시간으로 하루치를 추정한다 — 정밀한 값이 아니라 참고용 추정치.
 */
export function estimateBmr(weightKg) {
  if (!weightKg) return 0;
  return Math.round(weightKg * 24);
}
