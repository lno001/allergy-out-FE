import { useContext, useState } from "react";

import { updateMemberEmail } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { pickFieldError } from "../../../utils/apiError";
import { FormStack } from "./ModalForm.styled";

/**
 * @typedef {Object} EditEmailModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} currentEmail
 * @property {(newEmail: string) => void} onSuccess
 */

/**
 * 이메일 변경 모달 — PATCH /api/members/email
 *
 * Figma 원안은 "인증 요청" → 인증번호 확인 2단계지만, 이메일 인증 API가 아직
 * 없어서(명세서에 "미구현"으로 명시) 지금은 새 이메일을 받아 바로 PATCH한다.
 * 인증 API가 생기면 아래 주석 블록을 되살리고, handleSubmit을
 * "인증 요청 → 인증번호 확인 → PATCH" 순서로 바꾸면 된다.
 *
 * @param {EditEmailModalProps} props
 */
function EditEmailModal({ isOpen, onClose, currentEmail, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // // TODO(이메일 인증 API 생기면 되살리기)
  // const [verificationCode, setVerificationCode] = useState("");
  // const [codeSent, setCodeSent] = useState(false);
  // const [codeError, setCodeError] = useState("");
  //
  // const handleRequestVerification = async () => {
  //   await requestEmailVerification(email); // apis/memberApi.js 에 추가 필요
  //   setCodeSent(true);
  // };
  //
  // const handleVerifyCode = async () => {
  //   await verifyEmailCode(email, verificationCode); // apis/memberApi.js 에 추가 필요
  // };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    setError("");
    run(
      async () => {
        const res = await updateMemberEmail(email);
        onSuccess(res.data.email);
        showToast?.(res.msg, "success");
        handleClose();
      },
      { onError: (err) => setError(pickFieldError(err, "email")) },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="이메일 주소 변경"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={!email.trim()}>
            변경하기
          </Button>
        </>
      }
    >
      <FormStack>
        <Input label="현재 이메일" value={currentEmail} disabled readOnly />
        <Input
          label="새로운 이메일"
          required
          type="email"
          placeholder="new-email@allergy.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        {/*
          인증 API 생기면 위 Input을 아래 InlineFieldRow로 교체:

          <InlineFieldRow>
            <Input label="새로운 이메일" required type="email" value={email} onChange={...} error={error} />
            <Button variant="secondary" onClick={handleRequestVerification}>인증 요청</Button>
          </InlineFieldRow>
          <Input
            label="인증번호"
            required
            placeholder="인증번호 6자리를 입력해주세요"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            error={codeError}
          />
        */}
      </FormStack>
    </Modal>
  );
}

export default EditEmailModal;
