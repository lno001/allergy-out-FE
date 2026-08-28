import { useId } from "react";
import {
  InputField,
  InputLabelRow,
  InputLabel,
  InputRequiredMark,
  InputWrapper,
  StyledInput,
  InputSuffixButton,
  InputHelperText,
  InputErrorText,
} from "../../styles/common.styled";

/**
 * 서비스 전체 공용 입력창.
 * 흰 배경 + 회색 테두리로 통일. value/onChange로 직접 제어하는 제어 컴포넌트입니다.
 *
 * props
 * - label     : 위에 붙는 라벨 (생략 가능)
 * - required  : boolean — 라벨 옆 빨간 '*' (기본 false)
 * - error     : string — 에러 메시지. 있으면 테두리가 빨강으로 바뀌고 문구 표시.
 *               (boolean 아님! 에러 없을 땐 undefined / '')
 * - helperText: string — 회색 도움말 (error가 있으면 숨겨짐)
 * - suffix    : JSX — 입력창 안 오른쪽 요소 (비밀번호 눈모양 아이콘 등)
 * - id        : 생략하면 자동 생성 (label ↔ input 연결)
 * - ...rest   : 네이티브 <input> 속성 그대로 전달
 *               (type, placeholder, value, onChange, disabled, maxLength, name, autoComplete 등)
 *
 * @example
 * const [email, setEmail] = useState('');
 *
 * <Input
 *   label="이메일"
 *   required
 *   type="email"
 *   placeholder="you@example.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   helperText="회원가입 시 사용한 이메일"
 *   error={emailError}
 * />
 *
 * // 비밀번호 표시 토글
 * <Input
 *   label="비밀번호"
 *   type={show ? 'text' : 'password'}
 *   suffix={<button type="button" onClick={() => setShow(!show)}>👁</button>}
 * />
 */
function Input({
  label,
  required = false,
  error,
  helperText,
  suffix,
  id,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  // 실제로 화면에 렌더되는 캡션(에러 > 헬퍼)만 aria-describedby로 연결
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <InputField>
      {label && (
        <InputLabelRow>
          <InputLabel htmlFor={inputId}>{label}</InputLabel>
          {required && (
            <InputRequiredMark aria-hidden="true">*</InputRequiredMark>
          )}
        </InputLabelRow>
      )}

      <InputWrapper>
        <StyledInput
          id={inputId}
          $hasError={!!error}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {suffix && <InputSuffixButton>{suffix}</InputSuffixButton>}
      </InputWrapper>

      {error ? (
        <InputErrorText id={errorId}>{error}</InputErrorText>
      ) : (
        helperText && (
          <InputHelperText id={helperId}>{helperText}</InputHelperText>
        )
      )}
    </InputField>
  );
}

export default Input;
