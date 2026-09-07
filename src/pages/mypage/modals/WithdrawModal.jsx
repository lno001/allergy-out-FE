import { useContext, useState } from "react";

import { deleteMember } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import PasswordToggle from "../../../components/common/PasswordToggle";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import { MEMBER_MAX } from "../../../utils/memberValidation";
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
        // 탈퇴 후 처리(로그아웃 + 홈 이동)는 부모(ProfileEditPage)의 onSuccess 가 맡는다.
        onSuccess();
        handleClose();
      },
      {
        onError: (err) => {
          const { fieldErrors, formMessage } = splitFormError(err);
          setError(fieldErrors.memberPwd || "");
          if (formMessage) showToast?.(formMessage, "danger");
        },
      },
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
          maxLength={MEMBER_MAX.memberPwd}
          autoComplete="current-password"
          error={error}
          suffix={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          }
        />
      </FormStack>
    </Modal>
  );
}

export default WithdrawModal;
