import styled from "styled-components";

import { theme } from "../../../styles/theme";

export const Label = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.sm};
`;

export const AvatarPreviewWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.space.xl};
`;

export const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
  padding: ${theme.space["3xl"]};
  border: 1.5px dashed ${theme.color.primary200};
  border-radius: ${theme.radius.md};
  background-color: ${theme.color.primary50};
  cursor: pointer;
  text-align: center;
  transition: border-color ${theme.transition.fast}, background-color ${theme.transition.fast};

  &:hover {
    border-color: ${theme.color.primary};
    background-color: ${theme.color.primary100};
  }
`;

export const DropzoneIcon = styled.span`
  display: inline-flex;
  font-size: ${theme.fontSize["2xl"]};
  line-height: 1;
`;

export const DropzoneText = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.primary700};
`;

export const DropzoneSubText = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const ErrorText = styled.p`
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger600};
`;

export const ResetLink = styled.button`
  display: block;
  margin: ${theme.space.lg} auto 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  text-decoration: underline;

  &:hover:not(:disabled) {
    color: ${theme.color.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
