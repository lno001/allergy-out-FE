import styled from "styled-components";
import { theme } from "../../styles/theme";

export const SignupPageWrap = styled.main`
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding: ${theme.space["5xl"]} ${theme.space["2xl"]} ${theme.space["6xl"]};
`;

export const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space["3xl"]};
`;

export const SignupTitle = styled.h1`
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.lineHeight.tight};
  color: ${theme.color.text};
`;

export const SignupFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space["2xl"]};

  input {
    height: 52px;
    background-color: ${theme.color.white};
    border-radius: ${theme.radius.md};
  }
`;

export const EmailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: ${theme.space.md};
`;

export const EmailAt = styled.span`
  padding-bottom: 1.4rem;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.color.text};
`;

export const SignupActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.space["3xl"]};
  max-width: 720px;
  margin-top: ${theme.space["4xl"]};
`;
