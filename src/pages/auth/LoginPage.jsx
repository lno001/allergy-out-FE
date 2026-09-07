import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import PasswordToggle from "../../components/common/PasswordToggle";
import { useAuth } from "../../hooks/useAuth";
import {
  LoginFields,
  LoginForm,
  LoginPageWrap,
  LoginTitle,
  SignupLink,
  SignupLinkWrap,
} from "./LoginPage.styled";

function LoginPage() {
  const { user, isReady, login } = useAuth();
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    if (!memberId.trim() || !memberPwd) {
      setErrorMsg("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ memberId: memberId.trim(), memberPwd });
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMsg(err.msg ?? "아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return <Loading fullscreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <LoginPageWrap>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>로그인</LoginTitle>

        {errorMsg && (
          <Alert variant="danger" onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        <LoginFields>
          <Input
            name="memberId"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />
          <Input
            name="memberPwd"
            type={isPasswordVisible ? "text" : "password"}
            value={memberPwd}
            onChange={(event) => setMemberPwd(event.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            suffix={
              <PasswordToggle
                visible={isPasswordVisible}
                onToggle={handleTogglePassword}
              />
            }
          />
        </LoginFields>

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          로그인
        </Button>

        <SignupLinkWrap>
          <Link to="/signup">
            <SignupLink>회원가입 하러가기</SignupLink>
          </Link>
        </SignupLinkWrap>
      </LoginForm>
    </LoginPageWrap>
  );
}

export default LoginPage;
