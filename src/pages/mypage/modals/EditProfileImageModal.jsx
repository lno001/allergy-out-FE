import { useContext, useRef, useState } from "react";

import { deleteMemberImage, updateMemberImage } from "../../../apis/memberApi";
import Avatar from "../../../components/common/Avatar";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import {
  AvatarPreviewWrap,
  Dropzone,
  DropzoneIcon,
  DropzoneSubText,
  DropzoneText,
  ErrorText,
  Label,
  ResetLink,
} from "./EditProfileImageModal.styled";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * @typedef {Object} EditProfileImageModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string|null} currentImgPath
 * @property {string} memberName
 * @property {(newImgPath: string|null) => void} onSuccess
 */

/**
 * 프로필 사진 변경 모달 — PATCH /api/members/memberimg (multipart), 기본 프로필로는 DELETE.
 * 새 라이브러리 없이 네이티브 File API + 드래그 이벤트로 드롭존을 구현한다.
 * 아이콘은 이모지로 표시한다 (별도 아이콘 에셋/라이브러리 없음).
 * @param {EditProfileImageModalProps} props
 */
function EditProfileImageModal({ isOpen, onClose, currentImgPath, memberName, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  const validateAndSetFile = (candidate) => {
    if (!candidate) return;
    if (!ALLOWED_TYPES.includes(candidate.type)) {
      setError("jpg, jpeg, png, gif, webp 파일만 업로드할 수 있습니다.");
      return;
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setError("5MB 이하 파일만 업로드할 수 있습니다.");
      return;
    }
    setError("");
    setFile(candidate);
    setPreviewUrl(URL.createObjectURL(candidate));
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");
    onClose();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = () => {
    if (!file) return;
    setError("");
    run(
      async () => {
        const res = await updateMemberImage(file);
        onSuccess(res.data.memberImgPath);
        showToast?.(res.msg, "success");
        handleClose();
      },
      { onError: (err) => setError(err.msg) },
    );
  };

  const handleResetToDefault = () => {
    run(
      async () => {
        const res = await deleteMemberImage();
        onSuccess(null);
        showToast?.(res.msg, "success");
        handleClose();
      },
      { onError: (err) => showToast?.(err.msg, "danger") },
    );
  };

  const displayUrl = previewUrl || currentImgPath;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="프로필 사진 변경"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={!file}>
            저장하기
          </Button>
        </>
      }
    >
      <Label>현재 프로필 이미지</Label>
      <AvatarPreviewWrap>
        <Avatar name={memberName} src={displayUrl} size="lg" />
      </AvatarPreviewWrap>

      <Dropzone
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <DropzoneIcon aria-hidden="true">🖼️</DropzoneIcon>
        <DropzoneText>이미지를 드래그하거나 클릭하여 업로드</DropzoneText>
        <DropzoneSubText>지원 형식: JPG, PNG (최대 5MB)</DropzoneSubText>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          hidden
        />
      </Dropzone>
      {error && <ErrorText role="alert">{error}</ErrorText>}

      <ResetLink type="button" onClick={handleResetToDefault} disabled={submitting}>
        기본 프로필로 변경하기
      </ResetLink>
    </Modal>
  );
}

export default EditProfileImageModal;
