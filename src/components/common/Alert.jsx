import {
  AlertBox,
  AlertIcon,
  AlertMessage,
  AlertCloseButton,
  VARIANT_ICON,
} from "../../styles/common.styled";

/**
 * 페이지/폼에 고정으로 붙어있는 안내 배너. 에러 문구, 안내 메시지 등에 사용.
 * (전에 페이지마다 <p style={{color:'red'}}>로 땜빵했던 것들을 이걸로 교체)
 *
 * props
 * - variant : 'success' | 'danger' | 'warning' | 'info'  (기본 'info') — 색/아이콘 결정
 * - onClose : () => void — 넘기면 오른쪽에 닫기(✕) 버튼이 생김. 생략하면 계속 표시
 * - children: 배너에 표시할 메시지 (문자열 / JSX)
 *
 * 잠깐 떴다 사라지는 알림은 Alert가 아니라 Toast(ToastContext)를 쓰세요.
 *
 * @example
 * // 폼 상단 고정 에러
 * {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
 *
 * // 닫을 수 있는 안내
 * <Alert variant="info" onClose={() => setShowNotice(false)}>
 *   프로필을 완성하면 맞춤 레시피를 추천받을 수 있어요.
 * </Alert>
 */
function Alert({ variant = "info", children, onClose }) {
  return (
    <AlertBox $variant={variant} role="alert">
      <AlertIcon $variant={variant} aria-hidden="true">
        {VARIANT_ICON[variant]}
      </AlertIcon>
      <AlertMessage>{children}</AlertMessage>
      {onClose && (
        <AlertCloseButton type="button" onClick={onClose} aria-label="닫기">
          ✕
        </AlertCloseButton>
      )}
    </AlertBox>
  );
}

export default Alert;
