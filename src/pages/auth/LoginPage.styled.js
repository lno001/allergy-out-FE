import styled from "styled-components";
import { theme } from "../../styles/theme";

export const LoginPageWrap = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.space["4xl"]} ${theme.space["2xl"]};
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  gap: ${theme.space["2xl"]};
`;

export const LoginTitle = styled.h1`
  margin-bottom: ${theme.space.sm};
  font-size: ${theme.fontSize["2xl"]};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.lineHeight.tight};
  color: ${theme.color.text};
`;

export const LoginFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};

  /* 눈모양 토글 자리는 공용 StyledInput 의 $hasSuffix 가 확보한다(하드코딩 X). */
  input {
    height: 52px;
    background-color: ${theme.color.primary50};
    border-color: transparent;
  }

  input:hover:not(:disabled),
  input:focus {
    border-color: ${theme.color.primary200};
  }
`;

export const SignupLinkWrap = styled.p`
  margin-top: ${theme.space.sm};
  text-align: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const SignupLink = styled.span`
  color: ${theme.color.sub};

  &:hover {
    color: ${theme.color.primaryHover};
    text-decoration: underline;
  }
`;
