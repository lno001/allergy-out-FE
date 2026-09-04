import styled from "styled-components";

import { theme } from "../../../styles/theme";

/**
 * 마이페이지 모달(이름/이메일/연락처/비번/사진/탈퇴)이 공유하는 작은 폼 조각.
 * Modal의 ModalBody 자체엔 gap이 없어서, 필드 여러 개를 쌓을 땐 FormStack으로 감싼다.
 */

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
`;

export const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const InlineFieldRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${theme.space.sm};

  > *:first-child {
    flex: 1;
  }
`;

/* 라벨을 행 위로 빼고(SplitField/SplitFieldLabel), 그 아래에서 프리픽스·구분자와 입력칸을 나란히 둔다.
   에러도 개별 Input이 아니라 그룹 아래 한 줄(SplitFieldError)로 표시해 행 정렬이 안 흔들리게 한다. */
export const SplitField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const SplitFieldLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};

  ${({ $required }) =>
    $required &&
    `&::after { content: " *"; color: ${theme.color.danger}; }`}
`;

export const SplitFieldError = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger600};
`;

/* [010] [입력칸] — 라벨은 SplitFieldLabel 이 위에서 담당하므로 가운데 정렬만. */
export const PhoneFieldRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: ${theme.space.sm};
`;

/* [아이디] @ [도메인] */
export const EmailFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${theme.space.sm};
`;

/* 라벨 없는 프리픽스(010)/구분자(@). 행이 align-items:center 라 별도 여백 불필요. */
export const FieldAdornment = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  white-space: nowrap;
`;

/* 이메일 입력칸 아래 "빠른 입력" 도메인 칩. 팝업이 아니라 폼 흐름 안의 버튼이라
   ModalBody overflow 에 잘리지도, 위치 계산이 필요하지도 않다. */
export const DomainChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
`;

export const DomainChip = styled.button`
  padding: ${theme.space.xs} ${theme.space.md};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.full};
  background-color: ${theme.color.bg};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  transition:
    border-color ${theme.transition.fast},
    color ${theme.transition.fast};

  &:hover {
    border-color: ${theme.color.primary};
    color: ${theme.color.primary700};
  }

  ${({ $active }) =>
    $active &&
    `border-color: ${theme.color.primary}; color: ${theme.color.primary700}; font-weight: ${theme.fontWeight.semibold};`}
`;

export const HelperBox = styled.div`
  padding: ${theme.space.lg};
  background-color: ${theme.color.bgSoft};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  line-height: ${theme.lineHeight.loose};
`;

export const HelperBoxTitle = styled.p`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.xs};
`;
