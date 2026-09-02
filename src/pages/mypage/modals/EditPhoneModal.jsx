import { useContext, useState } from "react";

import { updateMemberPhone } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { pickFieldError } from "../../../utils/apiError";
import { FormStack } from "./ModalForm.styled";

/**
 * @typedef {Object} EditPhoneModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} currentPhone
 * @property {(newPhone: string) => void} onSuccess
 */

/**
 * 연락처 변경 모달 — PATCH /api/members/phone (010 + 숫자 8자리, 하이픈 없음)
 *
 * EditEmailModal과 같은 이유로 인증(OTP) 단계 없이 바로 PATCH한다.
 * 인증 API가 생기면 아래 주석 블록을 되살릴 것.
 *
 * @param {EditPhoneModalProps} props
 */
function EditPhoneModal({ isOpen, onClose, currentPhone, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // // TODO(연락처 인증 API 생기면 되살리기)
  // const [verificationCode, setVerificationCode] = useState("");
  // const [codeError, setCodeError] = useState("");
  //
  // const handleRequestVerification = async () => {
  //   await requestPhoneVerification(phone); // apis/memberApi.js 에 추가 필요
  // };
  //
  // const handleVerifyCode = async () => {
  //   await verifyPhoneCode(phone, verificationCode); // apis/memberApi.js 에 추가 필요
  // };

  const handleClose = () => {
    setPhone("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    setError("");
    run(
      async () => {
        const res = await updateMemberPhone(phone);
        onSuccess(res.data.phone);
        showToast?.(res.msg, "success");
        handleClose();
      },
      { onError: (err) => setError(pickFieldError(err, "phone")) },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="연락처 변경"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={!phone.trim()}>
            변경하기
          </Button>
        </>
      }
    >
      <FormStack>
        <Input label="현재 연락처" value={currentPhone} disabled readOnly />
        <Input
          label="새로운 연락처"
          required
          placeholder="숫자만 입력해 주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={error}
        />
        {/*
          인증 API 생기면 위 Input을 아래 InlineFieldRow로 교체:

          <InlineFieldRow>
            <Input label="새로운 연락처" required value={phone} onChange={...} error={error} />
            <Button variant="secondary" onClick={handleRequestVerification}>인증번호 전송</Button>
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

export default EditPhoneModal;
