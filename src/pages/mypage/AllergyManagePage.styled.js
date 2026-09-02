import styled from "styled-components";

import { theme } from "../../styles/theme";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space["2xl"]};
`;

export const Banner = styled.div`
  padding: ${theme.space["2xl"]};
  border-radius: ${theme.radius.lg};
  background: linear-gradient(135deg, ${theme.color.primary}, ${theme.color.primary700});
  color: ${theme.color.textOnPrimary};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const BannerTitle = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`;

export const BannerSubtitle = styled.p`
  font-size: ${theme.fontSize.sm};
  opacity: 0.9;
`;

export const Card = styled.section`
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  padding: ${theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
`;

export const CardTitle = styled.h2`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const AddRow = styled.form`
  display: flex;
  align-items: flex-end;
  gap: ${theme.space.md};

  /* Input 컴포넌트는 항상 label 자리를 차지해서(InputField가 column) 버튼과 높이를 맞추려면
     Input 쪽 flex:1, 버튼은 InputField의 실제 인풋 높이(48px)에 맞춰 아래로 정렬 */
  > *:first-child {
    flex: 1;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.sm};
  min-height: 32px;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  height: 32px;
  padding-inline: ${theme.space.md};
  border-radius: ${theme.radius.full};
  background-color: ${theme.color.primary50};
  color: ${theme.color.primary700};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`;

export const ChipRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: ${theme.radius.full};
  color: ${theme.color.primary700};
  font-size: 1.1rem;
  line-height: 1;

  &:hover {
    background-color: ${theme.color.primary200};
  }
`;

export const ChipEmptyText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const QuickAddGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const QuickAddGroupLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.sub};
`;

export const QuickAddRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.sm};
`;

export const QuickAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  height: 32px;
  padding-inline: ${theme.space.md};
  border-radius: ${theme.radius.full};
  border: 1.5px solid ${theme.color.primary200};
  background-color: ${theme.color.white};
  color: ${theme.color.primaryHover};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  transition: background-color ${theme.transition.fast}, border-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.primary50};
    border-color: ${theme.color.primary};
  }
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.space.sm};
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  transition: background-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.bgSoft};
  }
`;

export const OptionCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  accent-color: ${theme.color.primary};
  cursor: pointer;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
