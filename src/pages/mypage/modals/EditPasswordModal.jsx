import { useContext, useState } from "react";

import { updateMemberPassword } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import {
  MEMBER_MAX,
  MESSAGES,
  PASSWORD_CONFIRM_MISMATCH,
  validateMemberField,
} from "../../../utils/memberValidation";
import { FormStack, HelperBox, HelperBoxTitle } from "./ModalForm.styled";

/**
 * @typedef {Object} EditPasswordModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {() => void} onSuccess
 */

function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
    >
      {visible ? "🙈" : "👁"}
    </button>
  );
}

/**
 * 비밀번호 변경 모달 — PATCH /api/members/memberpwd
 *
 * 앱단은 maxLength(30) + 제출 시 BE 규격(RULES.password) 검증 + "새 비밀번호 ≠ 확인"(서버가
 * 확인 필드를 안 받아 FE 만 판정, PASSWORD_CONFIRM_MISMATCH)을 본다. 최종 판정은 서버.
 * "현재 비밀번호"는 형식검증 없이 빈값만 본다(해시 대조는 서버). HelperBox = BE 형식 안내 문구.
 *
 * @param {EditPasswordModalProps} props
 */
function EditPasswordModal({ isOpen, onClose, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });

  const toggleVisible = (key) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setVisible({ current: false, next: false, confirm: false });
    onClose();
  };

  const canSubmit = currentPassword && newPassword && confirmPassword;

  const handleSubmit = () => {
    if (!canSubmit || submitting) return; // Enter 등 조건 안 맞을 때 방지

    const nextErrors = {};
    const curMsg = validateMemberField("currentPassword", currentPassword);
    if (curMsg) nextErrors.currentPassword = curMsg;

    const newMsg = validateMemberField("newPassword", newPassword);
    if (newMsg) {
      nextErrors.newPassword = newMsg;
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = PASSWORD_CONFIRM_MISMATCH;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    run(
      async () => {
        const res = await updateMemberPassword({ currentPassword, newPassword });
        showToast?.(res.msg, "success");
        onSuccess();
        handleClose();
      },
      {
        // 서버가 필드를 짚어주면(형식 검증) 각 Input 밑에, 안 짚어주면
        // (비번 불일치 / 새 비번=기존과 동일 / 401 / 500) 토스트로 알린다.
        onError: (err) => {
          const { fieldErrors, formMessage } = splitFormError(err);
          setErrors(fieldErrors);
          if (formMessage) showToast?.(formMessage, "danger");
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="비밀번호 변경"
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
          <Input
            label="현재 비밀번호"
            required
            type={visible.current ? "text" : "password"}
            placeholder="현재 비밀번호를 입력해주세요"
            maxLength={MEMBER_MAX.memberPwd}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            suffix={
              <PasswordToggle
                visible={visible.current}
                onToggle={() => toggleVisible("current")}
              />
            }
          />
          <Input
            label="새 비밀번호"
            required
            type={visible.next ? "text" : "password"}
            placeholder="새 비밀번호를 입력해주세요"
            maxLength={MEMBER_MAX.memberPwd}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            suffix={
              <PasswordToggle
                visible={visible.next}
                onToggle={() => toggleVisible("next")}
              />
            }
          />
          <Input
            label="새 비밀번호 확인"
            required
            type={visible.confirm ? "text" : "password"}
            placeholder="새 비밀번호를 한 번 더 입력해주세요"
            maxLength={MEMBER_MAX.memberPwd}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            suffix={
              <PasswordToggle
                visible={visible.confirm}
                onToggle={() => toggleVisible("confirm")}
              />
            }
          />
          <HelperBox>
            <HelperBoxTitle>💡 비밀번호 안전 규칙</HelperBoxTitle>
            {MESSAGES.newPassword.format}
          </HelperBox>
        </FormStack>

        {/* Enter 로 폼 제출되게 하는 숨은 submit (footer 버튼은 form 밖이라 필요) */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}

export default EditPasswordModal;
