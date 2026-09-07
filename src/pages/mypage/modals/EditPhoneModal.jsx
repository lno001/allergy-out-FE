import { useContext, useId, useState } from "react";

import { updateMemberPhone } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import SplitField from "../../../components/common/SplitField";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSanitizedChange from "../../../hooks/useSanitizedChange";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import {
  MEMBER_HINT,
  MEMBER_MAX,
  toPhoneLocal,
  validatePhone,
} from "../../../utils/memberValidation";
import { FieldAdornment, FormStack, PhoneFieldRow } from "./ModalForm.styled";

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
 * 숫자만·8자리 제한은 앱단(toPhoneLocal + maxLength), 형식 문구는 서버(^010[0-9]{8}$)에 맡긴다.
 *
 * EditEmailModal과 같은 이유로 인증(OTP) 단계 없이 바로 PATCH한다.
 * 인증 API가 생기면 아래 주석 블록을 되살릴 것.
 *
 * @param {EditPhoneModalProps} props
 */
function EditPhoneModal({ isOpen, onClose, currentPhone, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const phoneId = useId();
  const [phone, setPhone] = useState(""); // 010 을 뺀 8자리
  const [error, setError] = useState("");

  const canSubmit = phone.length === MEMBER_MAX.phoneLocal;

  const phoneChange = useSanitizedChange(toPhoneLocal, (v) => {
    setPhone(v);
    if (error) setError("");
  });

  const handleClose = () => {
    setPhone("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit || submitting) return; // Enter 등 조건 안 맞을 때 방지
    const msg = validatePhone(phone);
    if (msg) {
      setError(msg);
      return;
    }
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
          <SplitField
            label="새로운 연락처"
            htmlFor={phoneId}
            required
            error={error}
          >
            {({ describedBy, invalid }) => (
              <PhoneFieldRow>
                <FieldAdornment>010</FieldAdornment>
                <Input
                  id={phoneId}
                  inputMode="numeric"
                  maxLength={MEMBER_MAX.phoneLocal}
                  placeholder={MEMBER_HINT.phone}
                  value={phone}
                  {...phoneChange}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                />
              </PhoneFieldRow>
            )}
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
