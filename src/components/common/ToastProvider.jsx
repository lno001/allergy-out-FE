import { createContext, useCallback, useState } from 'react';
import { ToastContainer, ToastItem, ToastIcon, VARIANT_ICON } from '../../styles/common.styled';

// hooks/useToast.js 가 이 컨텍스트를 구독합니다.
export const ToastContext = createContext(null);

/**
 * 앱 전체를 감싸는 Provider. main.jsx에서 <App />을 이걸로 한 번만 감싸면
 * 어느 페이지에서든 토스트를 띄울 수 있습니다. (main.jsx에 이미 적용됨)
 *
 * 꺼내 쓰기: const showToast = useContext(ToastContext);
 *   showToast(message, variant?, duration?)
 *   - message : 표시할 문구
 *   - variant : 'success' | 'danger' | 'warning' | 'info'  (기본 'success')
 *   - duration: 자동으로 사라지기까지 ms (기본 3000)
 *
 * 화면에 잠깐 떴다 사라지는 피드백 전용입니다. 계속 봐야 하는 안내/에러는 <Alert>를 쓰세요.
 *
 * @example
 * import { useContext } from 'react';
 * import { ToastContext } from '../components/common/ToastProvider';
 *
 * function SaveButton() {
 *   const showToast = useContext(ToastContext);
 *   const onSave = async () => {
 *     try {
 *       await updateMemberName(name);
 *       showToast('저장되었습니다.', 'success');
 *     } catch {
 *       showToast('저장에 실패했어요.', 'danger');
 *     }
 *   };
 *   return <Button onClick={onSave}>저장</Button>;
 * }
 */
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, variant = 'success', duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id}>
            <ToastIcon $variant={toast.variant} aria-hidden="true">
              {VARIANT_ICON[toast.variant]}
            </ToastIcon>
            {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
