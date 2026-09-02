import styled from "styled-components";

import { theme } from "../../styles/theme";

/**
 * RecipeCreatePage 전용 styled 컴포넌트.
 * -----------------------------------------------------------------------------
 * - 색 · 간격 · 폰트 · radius · shadow 는 theme 토큰만 사용한다 (CLAUDE.md 2.[스타일]).
 * - 검증 에러 표시는 브라우저 네이티브(:user-invalid)에 맡긴다 — 별도 $hasError prop 없음.
 * - border-width 는 theme 토큰이 없어 common.styled.js 와 동일하게 1px 리터럴을 쓴다
 *   (응답의 "다른 점" 표 B4 참고).
 * - 반응형 breakpoint 는 theme.js 에 media 토큰이 없어 이번엔 세로 1단 배치로 둔다 (B13).
 */

export const PageWrapper = styled.div`
  width: 100%;
  padding-block: ${theme.space["4xl"]};
  /* 좌우 여백 / 최대 너비는 GlobalStyle 의 .container 유틸리티가 담당한다
     (JSX 에서 className="container"). layout 이 생기면 그쪽으로 옮긴다. */
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.lg};
  margin-bottom: ${theme.space["2xl"]};
`;

export const PageHeading = styled.h1`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const BackButton = styled.button`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.color.text};
  }
`;

export const FormBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space["2xl"]};
`;

export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
  padding: ${theme.space["2xl"]};
  background: ${theme.color.bg};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.sm};
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const FieldLabelRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.space.xs};
`;

export const FieldLabelText = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
`;

export const RequiredMark = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.danger};
`;

export const HelperRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
`;

export const CharCount = styled.span`
  flex-shrink: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.space.md} ${theme.space.lg};
  font-family: inherit;
  font-size: ${theme.fontSize.md};
  line-height: ${theme.lineHeight.base};
  color: ${theme.color.text};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  resize: vertical;
  transition: border-color ${theme.transition.base};

  &::placeholder {
    color: ${theme.color.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${theme.color.borderFocus};
  }

  /* 사용자가 건드린 뒤에도 필수/형식이 안 맞으면 테두리 빨강 (네이티브) */
  &:user-invalid {
    border-color: ${theme.color.borderDanger};
  }
`;

export const MaterialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const MaterialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const TextInput = styled.input`
  width: 100%;
  padding: ${theme.space.md} ${theme.space.lg};
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  transition: border-color ${theme.transition.base};

  &::placeholder {
    color: ${theme.color.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${theme.color.borderFocus};
  }

  &:user-invalid {
    border-color: ${theme.color.borderDanger};
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.space.sm} ${theme.space.md};
  font-size: ${theme.fontSize.md};
  color: ${theme.color.sub};
  background: ${theme.color.white};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  transition: color ${theme.transition.fast}, border-color ${theme.transition.fast};

  &:hover:not(:disabled) {
    color: ${theme.color.danger};
    border-color: ${theme.color.borderDanger};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AddRowButton = styled.button`
  width: 100%;
  padding: ${theme.space.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.primary};
  background: ${theme.color.primary50};
  border: 1px dashed ${theme.color.primary200};
  border-radius: ${theme.radius.md};
  transition: background ${theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${theme.color.primary100};
  }

  &:disabled {
    color: ${theme.color.sub};
    background: ${theme.color.bgSoft};
    border-color: ${theme.color.border};
    cursor: not-allowed;
  }
`;

export const ImageDropzone = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  padding: ${theme.space["5xl"]} ${theme.space.lg};
  background: ${theme.color.gray50};
  border: 1px dashed ${theme.color.border};
  border-radius: ${theme.radius.md};
  transition: border-color ${theme.transition.fast}, background ${theme.transition.fast};

  &:hover {
    border-color: ${theme.color.borderFocus};
    background: ${theme.color.primary50};
  }
`;

export const DropzoneIcon = styled.span`
  font-size: ${theme.fontSize["2xl"]};
  line-height: 1;
  color: ${theme.color.gray400};
`;

export const DropzoneText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const DropzoneHint = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.placeholder};
`;

export const ImagePreviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};

  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.md};
  }
`;

export const PreviewButtonRow = styled.div`
  display: flex;
  gap: ${theme.space.sm};
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  padding: ${theme.space.lg};
  background: ${theme.color.gray50};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
`;

export const StepItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const StepOrderBadge = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${theme.space.xl};
  height: ${theme.space.xl};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.textOnPrimary};
  background: ${theme.color.primary};
  border-radius: ${theme.radius.full};
`;

export const StepItemTitle = styled.span`
  flex: 1;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
`;

export const StepImageLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: ${theme.space.xl};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  background: ${theme.color.white};
  border: 1px dashed ${theme.color.border};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  transition: border-color ${theme.transition.fast};

  &:hover {
    border-color: ${theme.color.borderFocus};
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.md};
  margin-top: ${theme.space.md};
`;
