import { useContext, useState } from "react";

import { deleteMember } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { pickFieldError } from "../../../utils/apiError";
import { Description, FormStack } from "./ModalForm.styled";

/**
 * @typedef {Object} WithdrawModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {() => void} onSuccess
 */

/**
 * 회원 탈퇴 모달 — DELETE /api/members
 * @param {WithdrawModalProps} props
 */
function WithdrawModal({ isOpen, onClose, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [memberPwd, setMemberPwd] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setMemberPwd("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = () => {
    setError("");
    run(
      async () => {
        const res = await deleteMember(memberPwd);
        showToast?.(res.msg, "success");
        // TODO(T-5 연동): tokenStorage.clearAccessToken() 실행 후 /login 이동.
        // 지금은 로그인 기능이 없어서 부모(ProfileEditPage)가 넘겨준 콜백만 호출한다.
        onSuccess();
        handleClose();
      },
      { onError: (err) => setError(pickFieldError(err, "memberPwd")) },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="회원 탈퇴"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!memberPwd}
          >
            탈퇴하기
          </Button>
        </>
      }
    >
      <FormStack>
        <Description>탈퇴하시려면 비밀번호를 입력해주세요.</Description>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
          value={memberPwd}
          onChange={(e) => setMemberPwd(e.target.value)}
          error={error}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          }
        />
      </FormStack>
    </Modal>
  );
}

export default WithdrawModal;
