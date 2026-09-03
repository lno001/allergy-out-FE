import styled from "styled-components";

import { theme } from "../../../styles/theme";

/* ProfileEditPage.styled.js의 CardWrap/SectionTitle/SectionDescription/SectionDivider와
   동일한 값을 그대로 씀 — 마이페이지 다른 탭이랑 이질감 없게 통일. */
export const CardWrap = styled.section`
  flex: 1;
  min-width: 0;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

export const SectionTitle = styled.h2`
  padding: ${theme.space["2xl"]} ${theme.space["2xl"]} 0;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const SectionDescription = styled.p`
  padding: ${theme.space.sm} ${theme.space["2xl"]} 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const SectionDivider = styled.div`
  border-top: 1px solid ${theme.color.gray100};
`;

/** 페이지 안의 각 그룹(빠른 추가/직접 추가/현재 필터/전체 항목)을 감싸는 패딩 블록.
 *  ProfileEditPage의 FieldGrid와 같은 패딩 값을 쓰되, 그리드가 아니라 세로 목록이라 flex column. */
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  padding: ${theme.space.xl} ${theme.space["2xl"]};
`;

export const SectionLabel = styled.h3`
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

  /* 묶음 버튼 — 항목이 전부 등록돼 있으면 눌린 상태로 표시(다시 누르면 전체 해제) */
  ${({ $active }) => $active && `
    background-color: ${theme.color.primary};
    border-color: ${theme.color.primary};
    color: ${theme.color.textOnPrimary};
  `}
`;

/* grid 대신 flex-wrap + align-items:flex-start — 하위 품목이 펼쳐져 항목마다 높이가
   달라져도(밀 17개 vs 잣 1개) 같은 줄의 다른 항목까지 억지로 늘어나지 않게 함. */
export const OptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.space.sm};
`;

export const OptionItem = styled.div`
  flex: 1 1 200px;
  min-width: 200px;
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  flex: 1;
  min-width: 0;
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

/* 하위 품목 있는 항목만 붙는 펼치기/접기 버튼 (▸/▾) */
export const OptionExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: ${theme.radius.md};
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  transition: background-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.bgSoft};
    color: ${theme.color.text};
  }
`;

export const OptionSubList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${theme.space.xs} 0 ${theme.space.xs} ${theme.space.xl};
`;

export const OptionSubLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  padding: 2px ${theme.space.sm};
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  transition: background-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.bgSoft};
    color: ${theme.color.text};
  }
`;

export const OptionSubCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: ${theme.color.primary};
  cursor: pointer;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
