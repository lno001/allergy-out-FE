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
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
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

  /* 인증 폼은 공용 Input(48px)보다 살짝 큰 52px. 배경·radius 는 StyledInput 이 이미 지정. */
  input {
    height: 52px;
  }
`;

/* 라벨·에러 셸은 공용 컴포넌트 components/common/SplitField.jsx 로 이관.
   여기서는 셸 안에 들어가는 "행 배치"(010 / @ 위치)만 둔다. */

/* [010] [뒤 8자리] — 값·간격은 모달의 PhoneFieldRow / FieldAdornment 와 동일하게 맞춘다. */
export const PhoneRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: ${theme.space.sm};
`;

/* 라벨 없는 프리픽스(010) / 구분자(@). 모달 FieldAdornment 와 동일 스펙. */
export const FieldPrefix = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  white-space: nowrap;
`;

/* [아이디] @ [도메인] — 라벨·에러는 SplitField 가 담당하므로 가운데 정렬만. */
export const EmailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const EmailAt = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
  white-space: nowrap;
`;

export const SignupActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.space["3xl"]};
  margin-top: ${theme.space["4xl"]};
`;
