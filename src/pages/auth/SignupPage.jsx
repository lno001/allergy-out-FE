import { useId, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { signup } from "../../apis/authApi";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import SplitField from "../../components/common/SplitField";
import { useAuth } from "../../hooks/useAuth";
import useSanitizedChange from "../../hooks/useSanitizedChange";
import {
  EMAIL_MAX,
  MEMBER_HINT,
  MEMBER_MAX,
  buildEmail,
  sanitizeEmail,
  sanitizeMemberId,
  toPhoneLocal,
  validateSignupForm,
} from "../../utils/memberValidation";
import { PasswordToggle } from "./LoginPage.styled";
import {
  EmailAt,
  EmailRow,
  FieldPrefix,
  PhoneRow,
  SignupActions,
  SignupFields,
  SignupForm,
  SignupPageWrap,
  SignupTitle,
} from "./SignupPage.styled";

const INITIAL_FORM = {
  memberId: "",
  memberPwd: "",
  memberPwdCheck: "",
  memberName: "",
  phone: "", // "010"을 뺀 뒤 8자리
  emailId: "",
  emailDomain: "",
};

const INITIAL_FIELD_ERRORS = {
  memberId: "",
  memberPwd: "",
  memberPwdCheck: "",
  memberName: "",
  phone: "",
  email: "",
};

/**
 * 서버 검증 실패 응답의 data({ 필드: msg })를 폼 필드 에러로 옮긴다.
 * 제출 시 validateSignupForm 이 못 잡은 경우(또는 중복 등 서버만 아는 것)의 최종 표시.
 */
function getFieldErrors(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const next = { ...INITIAL_FIELD_ERRORS };
  let hasFieldError = false;

  ["memberId", "memberPwd", "memberName", "phone", "email"].forEach((key) => {
    if (typeof data[key] === "string" && data[key]) {
      next[key] = data[key];
      hasFieldError = true;
    }
  });

  return hasFieldError ? next : null;
}

function SignupPage() {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const phoneFieldId = useId();
  const emailLocalId = useId();

  const nextEmail = buildEmail(form.emailId, form.emailDomain);

  // 제출 게이트: 필수값이 채워졌는지만 본다.
  // 길이(합산 50자 포함)·형식 위반은 여기서 막지 않고 제출 → 서버가 email 필드 에러로 돌려준다.
  // (각 칸 maxLength 50 은 유지 — 한 칸이 통째로 폭주하는 것만 방지)
  const canSubmit =
    Boolean(form.memberId.trim()) &&
    Boolean(form.memberPwd) &&
    Boolean(form.memberPwdCheck) &&
    Boolean(form.memberName.trim()) &&
    form.phone.length === MEMBER_MAX.phoneLocal &&
    Boolean(form.emailId.trim()) &&
    Boolean(form.emailDomain.trim());

  // 필드 하나를 갱신하고, 그 필드에 떠 있던 에러를 지운다.
  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    const fieldKey =
      name === "emailId" || name === "emailDomain" ? "email" : name;
    setFieldErrors((prev) =>
      prev[fieldKey] ? { ...prev, [fieldKey]: "" } : prev,
    );
  };

  // 정제 없는 필드(비번·비번확인·이름) — 형식은 제출 시 validateSignupForm 이 본다.
  // 이름은 한글이 유효하므로 여기서 손대지 않는다.
  const handleChange = (event) =>
    updateField(event.target.name, event.target.value);

  // 정제 있는 필드 — IME 조합 중엔 원문을 두고 조합이 끝났을 때만 정제한다.
  const memberIdChange = useSanitizedChange(sanitizeMemberId, (v) =>
    updateField("memberId", v),
  );
  const emailIdChange = useSanitizedChange(sanitizeEmail, (v) =>
    updateField("emailId", v),
  );
  const emailDomainChange = useSanitizedChange(sanitizeEmail, (v) =>
    updateField("emailDomain", v),
  );
  const phoneChange = useSanitizedChange(toPhoneLocal, (v) =>
    updateField("phone", v),
  );

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setErrorMsg("");

    // 제출 시 BE 규격(RULES/MESSAGES)으로 먼저 검증 — 통과해야 서버로 보낸다.
    const validationErrors = validateSignupForm(form);
    setFieldErrors({ ...INITIAL_FIELD_ERRORS, ...validationErrors });
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await signup({
        memberId: form.memberId.trim(),
        memberPwd: form.memberPwd,
        memberName: form.memberName.trim(),
        phone: `010${form.phone}`,
        email: nextEmail,
      });
      setIsSuccessOpen(true);
    } catch (err) {
      const nextFieldErrors = getFieldErrors(err.data);
      if (nextFieldErrors) {
        setFieldErrors(nextFieldErrors);
      } else {
        setErrorMsg(err.msg ?? "회원가입에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleGoLogin = () => {
    setIsSuccessOpen(false);
    navigate("/login", { replace: true });
  };

  if (!isReady) {
    return <Loading fullscreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <SignupPageWrap>
      <SignupForm onSubmit={handleSubmit}>
        <SignupTitle>회원가입</SignupTitle>

        {errorMsg && (
          <Alert variant="danger" onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        <SignupFields>
          <Input
            label="아이디"
            name="memberId"
            value={form.memberId}
            {...memberIdChange}
            placeholder={MEMBER_HINT.memberId}
            maxLength={MEMBER_MAX.memberId}
            autoComplete="username"
            error={fieldErrors.memberId}
          />
          <Input
            label="비밀번호"
            name="memberPwd"
            type={isPasswordVisible ? "text" : "password"}
            value={form.memberPwd}
            onChange={handleChange}
            placeholder={MEMBER_HINT.memberPwd}
            maxLength={MEMBER_MAX.memberPwd}
            autoComplete="new-password"
            error={fieldErrors.memberPwd}
            suffix={
              <PasswordToggle
                type="button"
                onClick={handleTogglePassword}
                aria-label={
                  isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"
                }
              >
                {isPasswordVisible ? "on" : "off"}
              </PasswordToggle>
            }
          />
          <Input
            label="비밀번호 확인"
            name="memberPwdCheck"
            type={isPasswordVisible ? "text" : "password"}
            value={form.memberPwdCheck}
            onChange={handleChange}
            placeholder="비밀번호 재입력"
            maxLength={MEMBER_MAX.memberPwd}
            autoComplete="new-password"
            error={fieldErrors.memberPwdCheck}
          />

          <SplitField
            label="전화번호"
            htmlFor={phoneFieldId}
            error={fieldErrors.phone}
          >
            {({ describedBy, invalid }) => (
              <PhoneRow>
                <FieldPrefix>010</FieldPrefix>
                <Input
                  id={phoneFieldId}
                  name="phone"
                  inputMode="numeric"
                  value={form.phone}
                  {...phoneChange}
                  placeholder={MEMBER_HINT.phone}
                  maxLength={MEMBER_MAX.phoneLocal}
                  autoComplete="tel-national"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                />
              </PhoneRow>
            )}
          </SplitField>

          <Input
            label="이름"
            name="memberName"
            value={form.memberName}
            onChange={handleChange}
            placeholder={MEMBER_HINT.memberName}
            maxLength={MEMBER_MAX.memberName}
            autoComplete="name"
            error={fieldErrors.memberName}
          />

          <SplitField
            label="이메일"
            htmlFor={emailLocalId}
            error={fieldErrors.email}
          >
            {({ describedBy, invalid }) => (
              <EmailRow>
                <Input
                  id={emailLocalId}
                  name="emailId"
                  value={form.emailId}
                  {...emailIdChange}
                  placeholder="이메일 아이디"
                  maxLength={EMAIL_MAX}
                  autoComplete="off"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                />
                <EmailAt>@</EmailAt>
                <Input
                  aria-label="이메일 도메인"
                  name="emailDomain"
                  value={form.emailDomain}
                  {...emailDomainChange}
                  placeholder="naver.com"
                  maxLength={EMAIL_MAX}
                  autoComplete="off"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                />
              </EmailRow>
            )}
          </SplitField>
        </SignupFields>

        <SignupActions>
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            가입하기
          </Button>
          <Button
            type="button"
            size="lg"
            fullWidth
            variant="secondary"
            onClick={handleCancel}
          >
            가입취소
          </Button>
        </SignupActions>
      </SignupForm>

      <Modal
        isOpen={isSuccessOpen}
        onClose={handleGoLogin}
        title="회원가입 완료"
        footer={
          <Button type="button" onClick={handleGoLogin}>
            로그인으로 가기
          </Button>
        }
      >
        회원가입에 성공했습니다. 로그인 후 서비스를 이용해 주세요.
      </Modal>
    </SignupPageWrap>
  );
}

export default SignupPage;
