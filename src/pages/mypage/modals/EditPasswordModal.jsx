import { useContext, useState } from "react";

import { updateMemberPassword } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
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
 * 안내 문구는 Figma 원본("영문 대소문자, 숫자, 특수문자 혼합") 대신 실제 서버 규칙
 * (영문+숫자 포함 8~20자, `^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$`)로 고쳐서 넣었다 —
 * Figma 문구대로 두면 실제로 통과되는 비밀번호(예: 특수문자 없는 영문+숫자)를
 * 사용자가 틀렸다고 오해할 수 있어서다.
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

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "새 비밀번호가 일치하지 않습니다." });
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
        // 서버가 필드를 안 짚어주는 케이스(비번 불일치 / 새 비번=기존과 동일)는
        // 특정 Input에 억지로 붙이면 오해를 살 수 있어 토스트로만 알린다.
        onError: (err) => {
          if (err.data) {
            setErrors(err.data);
          } else {
            showToast?.(err.msg, "danger");
          }
        },
      },
    );
  };

  const canSubmit = currentPassword && newPassword && confirmPassword;

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
      <FormStack>
        <Input
          label="현재 비밀번호"
          required
          type={visible.current ? "text" : "password"}
          placeholder="현재 비밀번호를 입력해주세요"
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
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          suffix={
            <PasswordToggle visible={visible.next} onToggle={() => toggleVisible("next")} />
          }
        />
        <Input
          label="새 비밀번호 확인"
          required
          type={visible.confirm ? "text" : "password"}
          placeholder="새 비밀번호를 한 번 더 입력해주세요"
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
          영문, 숫자를 포함하여 8자 이상 20자 이하로 설정해주세요.
        </HelperBox>
      </FormStack>
    </Modal>
  );
}

export default EditPasswordModal;
