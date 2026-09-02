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
