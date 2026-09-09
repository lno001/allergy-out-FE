import styled from "styled-components";

import { theme } from "../../styles/theme";

export const Wrap = styled.div`
  padding: ${theme.space.xl} ${theme.space["2xl"]} ${theme.space["2xl"]};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
`;

export const RegisterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.lg};
  flex-wrap: wrap;
  background-color: ${theme.color.bgSoft};
  border: 1.5px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.space.lg};
`;

export const DeviceBadge = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

/* 하단 칼로리 기반 레시피 추천 — 안내 문구 + 버튼 한 줄 */
export const RecommendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.lg};
  flex-wrap: wrap;
`;

export const RecommendHint = styled.p`
  flex: 1;
  min-width: 12rem;
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.base};
  color: ${theme.color.sub};

  strong {
    color: ${theme.color.text};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

export const BodyInputRow = styled.div`
  display: flex;
  gap: ${theme.space.lg};

  > * {
    flex: 1;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.space.md};
`;

export const StatCard = styled.div`
  background-color: ${theme.color.bgSoft};
  border-radius: ${theme.radius.md};
  padding: ${theme.space.lg};
`;

export const StatLabel = styled.p`
  margin: 0 0 ${theme.space.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const StatValue = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const StatUnit = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.sub};
`;

export const ChartBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const ChartTitle = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
`;

export const ChartSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
`;

export const ChartSvgWrap = styled.div`
  position: relative;
`;

export const ChartTooltip = styled.div`
  position: absolute;
  transform: translate(-50%, -130%);
  padding: ${theme.space.xs} ${theme.space.sm};
  background-color: ${theme.color.gray900};
  color: ${theme.color.white};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  border-radius: ${theme.radius.sm};
  white-space: nowrap;
  pointer-events: none;
`;

export const AxisRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AxisLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.placeholder};
  flex: 1;
  text-align: center;

  &:first-child {
    text-align: left;
  }
  &:last-child {
    text-align: right;
    color: ${theme.color.primaryHover};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

export const WeekAxisLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.placeholder};

  &[data-today="true"] {
    color: ${theme.color.primaryHover};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

export const EmptyNote = styled.p`
  margin: 0;
  padding: ${theme.space.xl} 0;
  text-align: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;
