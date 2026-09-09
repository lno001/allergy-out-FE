import { useContext, useRef, useState } from "react";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import { ToastContext } from "../../components/common/ToastProvider";
import { useBodyProfile } from "../../hooks/useBodyProfile";
import { useDevice } from "../../hooks/useDevice";
import { useStepsDashboard } from "../../hooks/useStepsDashboard";
import { calculateCaloriesBurned, estimateBmr } from "../../utils/calorieCalc";
import { SectionDivider, SectionTitle } from "./ProfileEditPage.styled";
import {
  AxisLabel,
  AxisRow,
  BodyInputRow,
  ChartBlock,
  ChartSvg,
  ChartSvgWrap,
  ChartTitle,
  ChartTooltip,
  DeviceBadge,
  EmptyNote,
  RegisterRow,
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

/** 숫자 입력값을 0~max로 잘라낸 문자열로. 빈 값은 그대로 둔다(입력 중 지우기 허용) */
function clampInput(rawValue, max) {
  if (rawValue === "") return rawValue;
  const num = Number(rawValue);
  if (Number.isNaN(num)) return rawValue;
  return String(Math.min(Math.max(num, 0), max));
}

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
  return { polyline, area, last, coords };
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
      steps: d.steps,
      isToday: i === days.length - 1,
      label: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
    };
  });
}

/**
 * 마이페이지 "개인정보 관리" 탭 맨 아래에 붙는 라즈베리파이 만보기 연동 섹션.
 * 계정마다 기기를 등록할 수 있고(1회원 1디바이스, POST /api/rasp/devices 멱등 등록),
 * 등록된 계정만 실제 걸음 데이터/차트를 볼 수 있다. 키/몸무게는 조회자가 입력해서
 * 칼로리 계산에만 쓴다.
 */
function RaspSection() {
  const showToast = useContext(ToastContext);
  const { deviceNo, isLoading: isDeviceLoading, isRegistering, error: deviceError, register } =
    useDevice();
  const { points, days, isLoading: isStepsLoading, error: stepsError } =
    useStepsDashboard(Boolean(deviceNo));
  const { heightCm, weightKg, setHeightCm, setWeightKg } = useBodyProfile();
  const [lineHover, setLineHover] = useState(null); // { index, x, y } | null — x/y는 차트 래퍼 기준 픽셀
  const [barHover, setBarHover] = useState(null); // { index, x, y } | null
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const lineWrapRef = useRef(null);
  const barWrapRef = useRef(null);

  const handleRegister = async () => {
    const result = await register();
    showToast(result.msg, result.ok ? "success" : "danger");
  };

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

  const handleLineMouseMove = (e) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - svgRect.left) / svgRect.width) * CHART_W;
    let nearest = 0;
    let nearestDist = Infinity;
    line.coords.forEach(([x], i) => {
      const dist = Math.abs(x - svgX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    const wrapRect = lineWrapRef.current.getBoundingClientRect();
    setLineHover({
      index: nearest,
      x: e.clientX - wrapRect.left,
      y: e.clientY - wrapRect.top,
    });
  };

  const barIndexAtEvent = (e) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - svgRect.left) / svgRect.width) * CHART_W;
    const slotWidth = CHART_W / bars.length;
    return Math.min(bars.length - 1, Math.max(0, Math.floor(svgX / slotWidth)));
  };

  const handleBarMouseMove = (e) => {
    const index = barIndexAtEvent(e);
    const wrapRect = barWrapRef.current.getBoundingClientRect();
    setBarHover({
      index,
      x: e.clientX - wrapRect.left,
      y: e.clientY - wrapRect.top,
    });
  };

  const handleBarClick = (e) => {
    const index = barIndexAtEvent(e);
    setSelectedBarIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <SectionDivider />
      <SectionTitle>라즈베리파이 연동</SectionTitle>

      <Wrap>
        {deviceError && <Alert variant="danger">{deviceError}</Alert>}

        {isDeviceLoading ? (
          <Loading label="디바이스 정보를 불러오는 중" />
        ) : deviceNo == null ? (
          <RegisterRow>
            <DeviceBadge>등록된 기기가 없어요.</DeviceBadge>
            <Button onClick={handleRegister} loading={isRegistering} size="sm">
              기기 연결하기
            </Button>
          </RegisterRow>
        ) : (
          <>
            {stepsError && <Alert variant="danger">{stepsError}</Alert>}

            {isStepsLoading ? (
              <Loading label="걸음 데이터를 불러오는 중" />
            ) : (
              <>
                <BodyInputRow>
                  <Input
                    label="키 (cm)"
                    type="number"
                    min={0}
                    max={300}
                    value={heightCm}
                    onChange={(e) =>
                      setHeightCm(clampInput(e.target.value, 300))
                    }
                    placeholder="200"
                  />
                  <Input
                    label="몸무게 (kg)"
                    type="number"
                    min={0}
                    max={700}
                    value={weightKg}
                    onChange={(e) =>
                      setWeightKg(clampInput(e.target.value, 700))
                    }
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
                      <ChartSvgWrap ref={lineWrapRef}>
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
                          {lineHover && (
                            <circle
                              cx={line.coords[lineHover.index][0]}
                              cy={line.coords[lineHover.index][1]}
                              r="5"
                              fill="#1F8A52"
                            />
                          )}
                          <rect
                            x="0"
                            y="0"
                            width={CHART_W}
                            height={CHART_H}
                            fill="transparent"
                            style={{ cursor: "pointer", pointerEvents: "all" }}
                            onMouseMove={handleLineMouseMove}
                            onMouseLeave={() => setLineHover(null)}
                          />
                        </ChartSvg>
                        {lineHover && (
                          <ChartTooltip style={{ left: lineHover.x, top: lineHover.y }}>
                            {`${points[lineHover.index].createDate.slice(11, 16)} · ${points[
                              lineHover.index
                            ].steps.toLocaleString()}보`}
                          </ChartTooltip>
                        )}
                      </ChartSvgWrap>
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
                      <ChartSvgWrap ref={barWrapRef}>
                        <ChartSvg viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
                          {bars.map((bar, i) => {
                            const isActive =
                              selectedBarIndex != null
                                ? i === selectedBarIndex
                                : bar.isToday;
                            return (
                              <rect
                                key={bar.label}
                                x={bar.x}
                                y={bar.y}
                                width={bar.width}
                                height={Math.max(bar.height, 2)}
                                rx="6"
                                fill={isActive ? "#2FA766" : "#B7E4C4"}
                              />
                            );
                          })}
                          <rect
                            x="0"
                            y="0"
                            width={CHART_W}
                            height={CHART_H}
                            fill="transparent"
                            style={{ cursor: "pointer", pointerEvents: "all" }}
                            onMouseMove={handleBarMouseMove}
                            onMouseLeave={() => setBarHover(null)}
                            onClick={handleBarClick}
                          />
                        </ChartSvg>
                        {barHover && (
                          <ChartTooltip style={{ left: barHover.x, top: barHover.y }}>
                            {`${bars[barHover.index].label} · ${bars[
                              barHover.index
                            ].steps.toLocaleString()}보`}
                          </ChartTooltip>
                        )}
                      </ChartSvgWrap>
                      <AxisRow>
                        {bars.map((bar, i) => (
                          <WeekAxisLabel
                            key={bar.label}
                            data-today={
                              selectedBarIndex != null
                                ? i === selectedBarIndex
                                : bar.isToday
                            }
                          >
                            {bar.label}
                          </WeekAxisLabel>
                        ))}
                      </AxisRow>
                    </>
                  )}
                </ChartBlock>
              </>
            )}
          </>
        )}
      </Wrap>
    </>
  );
}

export default RaspSection;
