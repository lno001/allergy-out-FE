import { useContext, useState } from "react";

import { updateMemberName } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import { MEMBER_HINT, MEMBER_MAX } from "../../../utils/memberValidation";
import { FormStack } from "./ModalForm.styled";

/**
 * @typedef {Object} EditNameModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} currentName
 * @property {(newName: string) => void} onSuccess
 */

/**
 * 이름 변경 모달 — PATCH /api/members/membername (2~30자)
 * 앱단은 maxLength 만 걸고, 길이 미달 등 형식 위반 문구는 서버 응답을 그대로 쓴다.
 * 전송 전 앞뒤 공백은 제거한다(회원가입과 동일).
 * @param {EditNameModalProps} props
 */
function EditNameModal({ isOpen, onClose, currentName, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || submitting) return; // Enter 등 조건 안 맞을 때 방지
    setError("");
    run(
      async () => {
        const res = await updateMemberName(trimmed);
        onSuccess(res.data.memberName);
        showToast?.(res.msg, "success");
        handleClose();
      },
      {
        onError: (err) => {
          const { fieldErrors, formMessage } = splitFormError(err);
          setError(fieldErrors.memberName || "");
          if (formMessage) showToast?.(formMessage, "danger");
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="이름 변경"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={!name.trim()}>
            저장하기
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
          <Input label="현재 이름" value={currentName} readOnly />
          <Input
            label="새로운 이름"
            required
            placeholder={MEMBER_HINT.memberName}
            maxLength={MEMBER_MAX.memberName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
          />
        </FormStack>

        {/* Enter 로 폼 제출되게 하는 숨은 submit (footer 버튼은 form 밖이라 필요) */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}

export default EditNameModal;
