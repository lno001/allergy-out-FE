import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { signup } from "../../apis/authApi";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../hooks/useAuth";
import { PasswordToggle } from "./LoginPage.styled";
import {
  EmailAt,
  EmailRow,
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
  phone: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const fieldKey =
      name === "emailId" || name === "emailDomain" ? "email" : name;
    if (fieldErrors[fieldKey]) {
      setFieldErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setFieldErrors(INITIAL_FIELD_ERRORS);

    const memberId = form.memberId.trim();
    const memberName = form.memberName.trim();
    const phone = form.phone.replace(/[^0-9]/g, "");
    const emailDomain = form.emailDomain.trim();
    const email = `${form.emailId.trim()}@${emailDomain}`;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const phonePattern = /^010[0-9]{8}$/;

    if (
      !memberId ||
      !form.memberPwd ||
      !form.memberPwdCheck ||
      !memberName ||
      !phone ||
      !form.emailId.trim() ||
      !emailDomain
    ) {
      setErrorMsg("필수 항목을 모두 입력해 주세요.");
      return;
    }

    if (memberId.length < 4 || memberId.length > 20) {
      setFieldErrors((prev) => ({
        ...prev,
        memberId: "아이디는 4자 이상 20자 이하로 입력해 주세요.",
      }));
      return;
    }

    if (!passwordPattern.test(form.memberPwd)) {
      setFieldErrors((prev) => ({
        ...prev,
        memberPwd:
          "비밀번호는 영문, 숫자를 포함하여 8자 이상 20자 이하로 입력해주세요.",
      }));
      return;
    }

    if (form.memberPwd !== form.memberPwdCheck) {
      setFieldErrors((prev) => ({
        ...prev,
        memberPwdCheck: "비밀번호가 일치하지 않습니다.",
      }));
      return;
    }

    if (memberName.length < 2 || memberName.length > 30) {
      setFieldErrors((prev) => ({
        ...prev,
        memberName: "이름은 2자 이상 30자 이하로 입력해주세요.",
      }));
      return;
    }

    if (!phonePattern.test(phone)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "올바른 연락처 형식이 아닙니다.",
      }));
      return;
    }

    if (!emailDomain.includes(".") || email.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        memberId,
        memberPwd: form.memberPwd,
        memberName,
        phone,
        email,
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
            onChange={handleChange}
            placeholder="아이디는 (4~20글자)"
            maxLength={20}
            autoComplete="username"
            error={fieldErrors.memberId}
          />
          <Input
            label="비밀번호"
            name="memberPwd"
            type={isPasswordVisible ? "text" : "password"}
            value={form.memberPwd}
            onChange={handleChange}
            placeholder="영문, 숫자 포함 8~20자"
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
            autoComplete="new-password"
            error={fieldErrors.memberPwdCheck}
          />
          <Input
            label="전화번호"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            autoComplete="tel"
            error={fieldErrors.phone}
          />
          <Input
            label="이름"
            name="memberName"
            value={form.memberName}
            onChange={handleChange}
            placeholder="이름은 2~30자"
            maxLength={30}
            autoComplete="name"
            error={fieldErrors.memberName}
          />
          <EmailRow>
            <Input
              label="이메일"
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              placeholder="이메일 주소"
              autoComplete="off"
              error={fieldErrors.email}
            />
            <EmailAt>@</EmailAt>
            <Input
              label={"\u00a0"}
              name="emailDomain"
              value={form.emailDomain}
              onChange={handleChange}
              placeholder="naver.com"
              autoComplete="off"
            />
          </EmailRow>
        </SignupFields>

        <SignupActions>
          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
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
