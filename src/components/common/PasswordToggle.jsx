import { PasswordToggleButton } from "../../styles/common.styled";

/**
 * @typedef {Object} PasswordToggleProps
 * @property {boolean} visible - 현재 비밀번호가 평문으로 보이는 상태인가.
 * @property {() => void} onToggle - 표시/숨김 전환.
 */

/**
 * 비밀번호 입력칸의 표시/숨김 토글. `<Input suffix={...} />` 로 넣는다.
 * 서비스 전체(로그인·회원가입·비밀번호 변경·탈퇴)가 이 컴포넌트를 공유한다.
 * 아이콘은 "현재 상태" 기준 — 보이면 👁, 가려지면 🙈. (aria-label 은 동작 기준)
 *
 * @param {PasswordToggleProps} props
 * @example
 * <Input type={visible ? "text" : "password"}
 *   suffix={<PasswordToggle visible={visible} onToggle={() => setVisible((v) => !v)} />} />
 */
function PasswordToggle({ visible, onToggle }) {
  return (
    <PasswordToggleButton
      type="button"
      onClick={onToggle}
      aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
    >
      {visible ? "👁" : "🙈"}
    </PasswordToggleButton>
  );
}

export default PasswordToggle;
