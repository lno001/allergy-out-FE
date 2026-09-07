import { useId } from "react";

import {
  SplitFieldError,
  SplitFieldLabel,
  SplitFieldWrap,
} from "../../styles/common.styled";

/**
 * @typedef {Object} SplitFieldA11y
 * @property {string|undefined} describedBy - 에러가 있을 때 에러 문구의 id. 없으면 undefined.
 * @property {true|undefined} invalid - 에러가 있을 때 true. 없으면 undefined.
 * @property {true|undefined} required - required prop 이 true 면 true. 없으면 undefined.
 *
 * @typedef {Object} SplitFieldProps
 * @property {string} label - 행 위에 붙는 라벨.
 * @property {string} [htmlFor] - 행의 "첫 번째" 입력 id (라벨 클릭 시 포커스 대상).
 * @property {boolean} [required] - 라벨 옆 빨간 '*'.
 * @property {string} [error] - 있으면 빨간 문구 + aria 연결. 없을 땐 '' / undefined.
 * @property {(a11y: SplitFieldA11y) => import('react').ReactNode} children
 *   - 입력 행을 렌더한다. 넘어오는 { describedBy, invalid } 를 각 <Input> 에 그대로 얹으면
 *     스크린리더가 칸 ↔ 에러를 연결한다.
 */

/**
 * "프리픽스 + 입력칸" 조합 필드(전화 010·, 이메일 @)를 위한 공용 셸.
 *
 * 에러 문구를 입력 행 밖에 둬서, 에러가 떠도 행 안쪽 칸 정렬이 흔들리지 않는다.
 * 에러에는 role="alert" 를 줘서 등장을 알리고, children 렌더 프롭으로 aria 연결값을 넘긴다.
 * 행의 그리드 배치(010 / @ 위치)는 화면마다 달라 이 컴포넌트가 갖지 않는다 — children 이 담당.
 *
 * @param {SplitFieldProps} props
 *
 * @example
 * const phoneId = useId();
 * <SplitField label="전화번호" htmlFor={phoneId} error={fieldErrors.phone}>
 *   {({ describedBy, invalid }) => (
 *     <PhoneRow>
 *       <FieldPrefix>010</FieldPrefix>
 *       <Input id={phoneId} aria-describedby={describedBy} aria-invalid={invalid} ... />
 *     </PhoneRow>
 *   )}
 * </SplitField>
 */
function SplitField({ label, htmlFor, required = false, error, children }) {
  const errorId = useId();
  const hasError = Boolean(error);

  const a11y = {
    describedBy: hasError ? errorId : undefined,
    invalid: hasError ? true : undefined,
    required: required || undefined,
  };

  return (
    <SplitFieldWrap>
      <SplitFieldLabel htmlFor={htmlFor} $required={required}>
        {label}
      </SplitFieldLabel>

      {children(a11y)}

      {hasError && (
        <SplitFieldError id={errorId} role="alert">
          {error}
        </SplitFieldError>
      )}
    </SplitFieldWrap>
  );
}

export default SplitField;
