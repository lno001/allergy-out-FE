import styled from "styled-components";

import { theme } from "../../styles/theme";

export const CardWrap = styled.section`
  flex: 1;
  min-width: 0;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

/* 아바타·이름·이메일을 전부 배너(초록 그라디언트) 안쪽에 둔다. 높이를 고정하지
   않고 패딩으로만 잡아서, 안에 든 내용(큰 아바타)에 맞춰 자연스럽게 늘어나게 한다. */
export const CardBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.lg};
  padding: ${theme.space.xl} ${theme.space["2xl"]};
  background: linear-gradient(90deg, ${theme.color.primaryHover}, ${theme.color.primary});
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.lg};
  min-width: 0;
`;

export const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  right: -0.2rem;
  bottom: -0.2rem;
  width: ${theme.space.xl};
  height: ${theme.space.xl};
  border-radius: ${theme.radius.full};
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadow.sm};
`;

export const AvatarEditIcon = styled.span`
  display: inline-flex;
  font-size: ${theme.fontSize.xs};
  line-height: 1;
`;

export const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  min-width: 0;
`;

/* 초록 배너 위에 올라가는 텍스트라 theme.color.text(검정) 대신 흰 계열을 쓴다. */
export const ProfileName = styled.p`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.textOnPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileEmail = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.primary50};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SectionDivider = styled.div`
  border-top: 1px solid ${theme.color.gray100};
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

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.space.xl};
  padding: ${theme.space.xl} ${theme.space["2xl"]} ${theme.space["2xl"]};
`;

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const FieldLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
`;

/* Input의 disabled 상태와 같은 bgSoft 회색 — 직접 타이핑해서 바꿀 수 있는 입력창처럼
   보이면 안 되고, "여긴 못 건드림, 옆의 수정 버튼으로만" 이라는 신호를 줘야 한다. */
export const FieldValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${theme.space["5xl"]};
  padding-inline: ${theme.space.lg};
  background-color: ${theme.color.bgSoft};
  border: 1.5px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
`;

export const FieldValue = styled.span`
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FieldEditLink = styled.button`
  flex-shrink: 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.primaryHover};

  &:hover {
    color: ${theme.color.primary800};
  }
`;
