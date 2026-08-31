import { useEffect, useId } from 'react';
import {
  ModalBackdrop,
  ModalBox,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '../../styles/common.styled';

/**
 * 이름/비밀번호/이메일 변경, 회원 탈퇴 등 모든 다이얼로그가 공유하는 껍데기.
 * 배경 클릭 · ✕ 버튼 · ESC 키로 닫힘(onClose 호출). 닫힘 상태면 아무것도 렌더하지 않음.
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose} role="presentation">
      <ModalBox
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

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </ModalBackdrop>
  );
}

export default Modal;
