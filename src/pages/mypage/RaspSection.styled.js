import styled from "styled-components";

import { theme } from "../../styles/theme";

export const Wrap = styled.div`
  padding: ${theme.space.xl} ${theme.space["2xl"]} ${theme.space["2xl"]};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
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

export const EmptyNote = styled.p`
  margin: 0;
  padding: ${theme.space.xl} 0;
  text-align: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;
