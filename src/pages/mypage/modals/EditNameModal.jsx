import { useContext, useState } from "react";

import { updateMemberName } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
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
    setError("");
    run(
      async () => {
        const res = await updateMemberName(name);
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
      <FormStack>
        <Input label="현재 이름" value={currentName} disabled readOnly />
        <Input
          label="새로운 이름"
          required
          placeholder="변경할 이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
        />
      </FormStack>
    </Modal>
  );
}

export default EditNameModal;
