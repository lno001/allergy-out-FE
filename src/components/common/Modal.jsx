import { useEffect, useId, useRef } from 'react';
import {
  ModalBackdrop,
  ModalBox,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '../../styles/common.styled';

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * 이름/비밀번호/이메일 변경, 회원 탈퇴 등 모든 다이얼로그가 공유하는 껍데기.
 * 배경 클릭 · ✕ 버튼 · ESC 키로 닫힘(onClose 호출). 닫힘 상태면 아무것도 렌더하지 않음.
 *
 * 열리면 모달 안 첫 포커스 가능한 요소로 포커스를 옮기고, Tab/Shift+Tab이 모달
 * 밖으로 못 나가게 가두며(focus trap), 닫히면 열기 전 포커스였던 요소로 되돌린다.
 *
 * props
 * - isOpen  : boolean — 열림/닫힘
 * - onClose : () => void — 닫기 요청 시 호출 (배경 클릭 / ✕ / ESC 공통)
 * - title   : 헤더 제목 ("이름 변경", "회원 탈퇴" 등)
 * - footer  : JSX — 하단 버튼 영역. 보통 취소(secondary) + 확정 조합. 생략하면 영역 자체가 안 생김
 * - size    : 'sm' | 'md' | 'lg'  (기본 'sm')
 * - children: 모달 본문
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>이름 변경</Button>
 *
 * <Modal
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="이름 변경"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
 *       <Button onClick={handleSubmit}>저장</Button>
 *     </>
 *   }
 * >
 *   <Input label="새 이름" value={name} onChange={(e) => setName(e.target.value)} />
 * </Modal>
 */
function Modal({ isOpen, onClose, title, children, footer, size = 'sm' }) {
  const titleId = useId();
  const boxRef = useRef(null);
  const bodyRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // onClose는 부모(모달을 쓰는 쪽)가 렌더될 때마다 새 함수로 내려오는 경우가 많다
  // (예: 인라인 화살표 함수). 아래 큰 useEffect의 deps에 onClose를 직접 넣으면
  // 사용자가 입력창에 한 글자 칠 때마다(부모 리렌더 → onClose 참조 변경) 이 effect가
  // 다시 돌면서 "열릴 때 포커스 이동" 로직까지 매번 재실행돼, 타이핑 중 포커스가
  // 자꾸 ✕ 버튼으로 튀는 버그가 있었다. ref에 최신 onClose만 담아 두고
  // effect는 isOpen에만 반응하게 분리했다.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;

    const getFocusable = (root) =>
      root ? Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)) : [];

    // 처음 포커스는 ✕ 버튼(헤더, DOM상 제일 먼저 나옴)보다 본문의 첫 입력칸이 낫다.
    const initialTarget =
      getFocusable(bodyRef.current)[0] || getFocusable(boxRef.current)[0] || boxRef.current;
    initialTarget?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable(boxRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose} role="presentation">
      <ModalBox
        ref={boxRef}
        tabIndex={-1}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose} aria-label="닫기">
            ✕
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody ref={bodyRef}>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </ModalBackdrop>
  );
}

export default Modal;
