import { useContext, useState } from "react";

import { updateMemberEmail } from "../../../apis/memberApi";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Modal from "../../../components/common/Modal";
import { ToastContext } from "../../../components/common/ToastProvider";
import useSubmitAction from "../../../hooks/useSubmitAction";
import { splitFormError } from "../../../utils/apiError";
import {
  DomainChip,
  DomainChips,
  EmailFieldRow,
  FieldAdornment,
  FormStack,
  SplitField,
  SplitFieldError,
  SplitFieldLabel,
} from "./ModalForm.styled";

/** "빠른 입력" 칩 후보. 눌러 도메인 칸을 채우거나, 그냥 직접 쳐도 된다. */
const DOMAIN_SUGGESTIONS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "nate.com",
];

/** 제출 허용용 느슨한 도메인 체크 — 실제 유효성은 서버(@Email)가 판정한다. */
const looksLikeDomain = (domain) => /.+\..+/.test(domain.trim());

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
 * 회원가입과 동일하게 아이디 / @ / 도메인 세 칸으로 나눈다. 도메인은 직접 입력하거나
 * 아래 "빠른 입력" 칩으로 흔한 도메인을 채운다(칩은 팝업이 아니라 폼 흐름 안의 버튼).
 * 라벨·에러는 행 밖(SplitField)에 두어, 에러가 떠도 세 칸 정렬이 흔들리지 않게 한다.
 * 형식 검증은 서버가 하므로(@Email → 400 {email: msg}) 입력값을 그대로 이어 붙여 보낸다.
 * 입력칸 Enter → 변경하기(form submit).
 *
 * Figma 원안의 "인증 요청 → 인증번호" 2단계는 이메일 인증 API 미구현이라 생략(바로 PATCH).
 * 인증 API가 생기면 아래 주석 블록을 되살릴 것.
 *
 * @param {EditEmailModalProps} props
 */
function EditEmailModal({ isOpen, onClose, currentEmail, onSuccess }) {
  const showToast = useContext(ToastContext);
  const { submitting, run } = useSubmitAction();
  const [local, setLocal] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const nextEmail = `${local.trim()}@${domain.trim()}`;
  const canSubmit = Boolean(local.trim()) && looksLikeDomain(domain);

  const clearError = () => {
    if (error) setError("");
  };

  const handleClose = () => {
    setLocal("");
    setDomain("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit || submitting) return; // Enter 등 조건 안 맞을 때 방지
    setError("");
    run(
      async () => {
        const res = await updateMemberEmail(nextEmail);
        onSuccess(res.data.email);
        showToast?.(res.msg, "success");
        handleClose();
      },
      {
        onError: (err) => {
          const { fieldErrors, formMessage } = splitFormError(err);
          setError(fieldErrors.email || "");
          if (formMessage) showToast?.(formMessage, "danger");
        },
      },
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
          <Input label="현재 이메일" value={currentEmail} disabled readOnly />

          <SplitField>
            <SplitFieldLabel $required>새로운 이메일</SplitFieldLabel>
            <EmailFieldRow>
              <Input
                aria-label="이메일 아이디"
                autoComplete="off"
                placeholder="이메일 아이디"
                value={local}
                onChange={(e) => {
                  setLocal(e.target.value);
                  clearError();
                }}
              />
              <FieldAdornment>@</FieldAdornment>
              <Input
                aria-label="이메일 도메인"
                autoComplete="off"
                placeholder="naver.com"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  clearError();
                }}
              />
            </EmailFieldRow>
            <DomainChips>
              {DOMAIN_SUGGESTIONS.map((d) => (
                <DomainChip
                  key={d}
                  type="button"
                  $active={domain.trim().toLowerCase() === d}
                  onClick={() => {
                    setDomain(d);
                    clearError();
                  }}
                >
                  {d}
                </DomainChip>
              ))}
            </DomainChips>
            {error && <SplitFieldError>{error}</SplitFieldError>}
          </SplitField>
        </FormStack>

        {/* Enter 로 폼 제출되게 하는 숨은 submit (footer 버튼은 form 밖이라 필요) */}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>

      {/*
        인증 API 생기면 위 세 칸을 인증 요청 버튼과 묶고, 아래에 인증번호 Input을 추가:
        <InlineFieldRow>
          <Input aria-label="새로운 이메일" ... />
          <Button variant="secondary" onClick={handleRequestVerification}>인증 요청</Button>
        </InlineFieldRow>
        <Input label="인증번호" required placeholder="인증번호 6자리를 입력해주세요" ... />
      */}
    </Modal>
  );
}

export default EditEmailModal;
