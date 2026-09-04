import { useContext, useState } from "react";

import { updateMemberPhone } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import {
  FieldAdornment,
  FormStack,
  PhoneFieldRow,
  SplitField,
  SplitFieldError,
  SplitFieldLabel,
} from "./ModalForm.styled";

/** 010 뒤 8자리만 입력받는다. 서버 형식은 ^010[0-9]{8}$. */
const PHONE_LOCAL_LENGTH = 8;

/**
 * @typedef {Object} EditPhoneModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} currentPhone
 * @property {(newPhone: string) => void} onSuccess
 */

/**
 * 연락처 변경 모달 — PATCH /api/members/phone
 * "010" 은 고정 프리픽스로 두고 뒤 8자리(숫자만)만 입력받는다. 입력칸 Enter → 변경하기.
 *
 * EditEmailModal과 같은 이유로 인증(OTP) 단계 없이 바로 PATCH한다.
 * 인증 API가 생기면 아래 주석 블록을 되살릴 것.
 *
 * @param {EditPhoneModalProps} props
 */
function EditPhoneModal({ isOpen, onClose, currentPhone, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [phone, setPhone] = useState(""); // 010 을 뺀 8자리
  const [error, setError] = useState("");

  const canSubmit = phone.length === PHONE_LOCAL_LENGTH;

  // 숫자만 통과. "010xxxxxxxx"(11자리)를 붙여넣으면 앞 010 을 떼고 뒤 8자만 취한다.
  const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("010")) {
      digits = digits.slice(3);
    }
    setPhone(digits.slice(0, PHONE_LOCAL_LENGTH));
    if (error) setError("");
  };

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
    if (!canSubmit || submitting) return; // Enter 등 조건 안 맞을 때 방지
    setError("");
    run(
      async () => {
        const res = await updateMemberPhone(`010${phone}`);
        onSuccess(res.data.phone);
        showToast?.(res.msg, "success");
        handleClose();
      },
      {
        onError: (err) => {
          const { fieldErrors, formMessage } = splitFormError(err);
          setError(fieldErrors.phone || "");
          if (formMessage) showToast?.(formMessage, "danger");
        },
      },
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
          <Button onClick={handleSubmit} loading={submitting} disabled={!canSubmit}>
            변경하기
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormStack>
          <Input label="현재 연락처" value={currentPhone} disabled readOnly />
          <SplitField>
            <SplitFieldLabel $required>새로운 연락처</SplitFieldLabel>
            <PhoneFieldRow>
              <FieldAdornment>010</FieldAdornment>
              <Input
                aria-label="새로운 연락처"
                inputMode="numeric"
                maxLength={PHONE_LOCAL_LENGTH}
                placeholder="8자리 숫자"
                value={phone}
                onChange={handlePhoneChange}
              />
            </PhoneFieldRow>
            {error && <SplitFieldError>{error}</SplitFieldError>}
          </SplitField>
        </FormStack>

        {/* Enter 로 폼 제출되게 하는 숨은 submit (footer 버튼은 form 밖이라 필요) */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>

      {/*
        인증 API 생기면 위 Input을 아래처럼 교체:
        <InlineFieldRow>
          <Input label="새로운 연락처" required value={phone} onChange={...} error={error} />
          <Button variant="secondary" onClick={handleRequestVerification}>인증번호 전송</Button>
        </InlineFieldRow>
        <Input label="인증번호" required placeholder="인증번호 6자리를 입력해주세요" ... />
      */}
    </Modal>
  );
}

export default EditPhoneModal;
