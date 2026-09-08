import Alert from "../../components/common/Alert";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import { useBodyProfile } from "../../hooks/useBodyProfile";
import { useStepsDashboard } from "../../hooks/useStepsDashboard";
import { calculateCaloriesBurned, estimateBmr } from "../../utils/calorieCalc";
import { SectionDivider, SectionTitle } from "./ProfileEditPage.styled";
import {
  AxisLabel,
  AxisRow,
  BodyInputRow,
  ChartBlock,
  ChartSvg,
  ChartTitle,
  EmptyNote,
  StatCard,
  StatGrid,
  StatLabel,
  StatUnit,
  StatValue,
  WeekAxisLabel,
  Wrap,
} from "./RaspSection.styled";

const CHART_W = 600;
const CHART_H = 140;
const BASELINE_Y = 130;
const TOP_Y = 10;

/** points(오늘 누적 기록)를 꺾은선 + 아래 채움 영역 좌표로 변환. 0부터 시작한다고 보고 스케일링 */
function buildLineChart(points) {
  if (points.length === 0) return null;
  const max = Math.max(...points.map((p) => p.steps), 1);
  const stepX = points.length > 1 ? CHART_W / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = points.length > 1 ? i * stepX : CHART_W / 2;
    const y = BASELINE_Y - (p.steps / max) * (BASELINE_Y - TOP_Y);
    return [Math.round(x), Math.round(y)];
  });
  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area =
    `M${coords[0][0]},${BASELINE_Y} ` +
    coords.map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${coords[coords.length - 1][0]},${BASELINE_Y} Z`;
  const last = coords[coords.length - 1];
  return { polyline, area, last };
}

/**
 * days(최근 7일, 항상 7개)를 막대 좌표로 변환.
 * 아래 날짜 라벨(WeekAxisLabel)이 CSS flexbox로 전체 너비를 N등분해서 각 칸 가운데 정렬되므로,
 * 막대도 같은 방식(전체 너비를 N등분 → 그 칸 중심에 배치)으로 계산해야 막대와 라벨이 정렬된다.
 * 고정 픽셀(x = 10 + i*80)로 계산하면 막대들이 실제 칸 너비보다 좁게 몰려서, 뒤로 갈수록
 * 라벨과 막대 중심이 어긋난다(특히 마지막 "오늘" 막대에서 어긋남이 가장 커짐).
 */
function buildBars(days) {
  const max = Math.max(...days.map((d) => d.steps), 1);
  const slotWidth = CHART_W / days.length;
  const gap = 20;
  const barWidth = slotWidth - gap;
  return days.map((d, i) => {
    const height = Math.round((d.steps / max) * (BASELINE_Y - TOP_Y));
    const slotCenter = slotWidth * (i + 0.5);
    return {
      x: Math.round(slotCenter - barWidth / 2),
      y: BASELINE_Y - height,
      width: Math.round(barWidth),
      height,
      isToday: i === days.length - 1,
      label: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
    };
  });
}

/**
 * 마이페이지 "개인정보 관리" 탭 맨 아래에 붙는 라즈베리파이 만보기 연동 시연 섹션.
 * 실제로 기기를 연결할 수 있는 건 팀에서 운영하는 데모 기기 하나뿐이라, 이 화면은
 * 사용자별 기기 등록/연결 UI 없이 그 데모 기기의 걸음 데이터를 그대로 보여주는
 * "기능 시연" 성격이다. 키/몸무게만 조회자가 입력해서 칼로리 계산에 개인화를 더한다.
 */
function RaspSection() {
  const { points, days, isLoading, isConnected, error } = useStepsDashboard();
  const { heightCm, weightKg, setHeightCm, setWeightKg } = useBodyProfile();

  const todaySteps = points.length > 0 ? points[points.length - 1].steps : 0;
  const activityCalories = calculateCaloriesBurned({
    steps: todaySteps,
    heightCm: Number(heightCm),
    weightKg: Number(weightKg),
  });
  const bmr = estimateBmr(Number(weightKg));
  const totalCalories = activityCalories + bmr;

  const line = buildLineChart(points);
  const bars = days.length > 0 ? buildBars(days) : [];

  return (
    <>
      <SectionDivider />
      <SectionTitle>라즈베리파이 연동</SectionTitle>

      <Wrap>
        {error && <Alert variant="danger">{error}</Alert>}

        {isLoading ? (
          <Loading label="걸음 데이터를 불러오는 중" />
        ) : !isConnected ? (
          <EmptyNote>아직 데모 기기가 연동되지 않았어요.</EmptyNote>
        ) : (
          <>
            <BodyInputRow>
              <Input
                label="키 (cm)"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="200"
              />
              <Input
                label="몸무게 (kg)"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
              />
              <StatCard>
                <StatLabel>기초대사량 (추정)</StatLabel>
                <StatValue>
                  {bmr.toLocaleString()} <StatUnit>kcal</StatUnit>
                </StatValue>
              </StatCard>
            </BodyInputRow>

            <StatGrid>
              <StatCard>
                <StatLabel>오늘 걸음 수</StatLabel>
                <StatValue>
                  {todaySteps.toLocaleString()} <StatUnit>보</StatUnit>
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>걸음 소모 칼로리 (추정)</StatLabel>
                <StatValue>
                  {activityCalories.toLocaleString()} <StatUnit>kcal</StatUnit>
                </StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>총 소모 칼로리 (추정)</StatLabel>
                <StatValue>
                  {totalCalories.toLocaleString()} <StatUnit>kcal</StatUnit>
                </StatValue>
              </StatCard>
            </StatGrid>

            <ChartBlock>
              <ChartTitle>오늘 걸음 추이</ChartTitle>
              {line ? (
                <>
                  <ChartSvg viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
                    <path d={line.area} fill="#EFF9F1" />
                    <polyline
                      points={line.polyline}
                      fill="none"
                      stroke="#2FA766"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <circle cx={line.last[0]} cy={line.last[1]} r="5" fill="#1F8A52" />
                  </ChartSvg>
                  <AxisRow>
                    <AxisLabel>{points[0].createDate.slice(11, 16)}</AxisLabel>
                    <AxisLabel>{points[points.length - 1].createDate.slice(11, 16)}</AxisLabel>
                  </AxisRow>
                </>
              ) : (
                <EmptyNote>아직 오늘 걸음 기록이 없어요.</EmptyNote>
              )}
            </ChartBlock>

            <ChartBlock>
              <ChartTitle>최근 7일</ChartTitle>
              {bars.length > 0 && (
                <>
                  <ChartSvg viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
                    {bars.map((bar) => (
                      <rect
                        key={bar.label}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={Math.max(bar.height, 2)}
                        rx="6"
                        fill={bar.isToday ? "#2FA766" : "#B7E4C4"}
                      />
                    ))}
                  </ChartSvg>
                  <AxisRow>
                    {bars.map((bar) => (
                      <WeekAxisLabel key={bar.label} data-today={bar.isToday}>
                        {bar.label}
                      </WeekAxisLabel>
                    ))}
                  </AxisRow>
                </>
              )}
            </ChartBlock>
          </>
        )}
      </Wrap>
    </>
  );
}

export default RaspSection;
