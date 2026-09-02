import { useContext, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Alert from "./components/common/Alert";
import Avatar from "./components/common/Avatar";
import Badge from "./components/common/Badge";
import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Loading from "./components/common/Loading";
import Modal from "./components/common/Modal";
import Pagination from "./components/common/Pagination";
import Table from "./components/common/Table";
import { ToastContext } from "./components/common/ToastProvider";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { useAuth } from "./hooks/useAuth";
import {
  NavIcon,
  NavItem,
  NavList,
  PageWrap,
  ProfileEmail,
  ProfileName,
  ProfileSummary,
  SidebarWrap,
} from "./pages/mypage/MyPage.styled";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";

/**
 * 공통 컴포넌트 갤러리.
 * default export 된 <Preview /> 를 App.jsx 가 렌더링합니다.
 * GlobalStyle · ToastProvider · Router 는 main.jsx 가 감쌉니다.
 * 토스트는 hooks 가 없어 ToastContext 를 직접 구독합니다.
 */

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          fontSize: "1.6rem",
          marginBottom: "1.2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.6rem",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.2rem",
          alignItems: "flex-start",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function ButtonGallery() {
  const variants = [
    "primary",
    "secondary",
    "ghost",
    "warning",
    "danger",
    "dangerOutline",
  ];
  return (
    <Section title="Button">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
      <Button loading>loading</Button>
      <Button disabled>disabled</Button>
      <Button variant="secondary" size="md"></Button>
    </Section>
  );
}

function AvatarGallery() {
  return (
    <Section title="Avatar">
      <Avatar name="김민지" size="sm" />
      <Avatar name="김민지" size="lg" />
    </Section>
  );
}

function BadgeGallery() {
  const variants = ["neutral", "success", "info", "danger", "dangerOutline"];
  return (
    <Section title="Badge">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </Section>
  );
}

function AlertGallery() {
  const variants = ["success", "danger", "warning", "info"];
  return (
    <Section title="Alert">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          width: "100%",
        }}
      >
        {variants.map((variant) => (
          <Alert key={variant} variant={variant}>
            {variant} 상태 메시지입니다.
          </Alert>
        ))}
        <Alert variant="info" onClose={() => alert("닫기 클릭")}>
          닫기 버튼이 있는 Alert
        </Alert>
      </div>
    </Section>
  );
}

function InputGallery() {
  return (
    <Section title="Input">
      <Input label="이름" placeholder="홍길동" />
      <Input
        label="이메일"
        required
        placeholder="you@example.com"
        helperText="회원가입 시 사용한 이메일"
      />
      <Input
        label="비밀번호"
        type="password"
        error="비밀번호가 일치하지 않습니다."
      />
    </Section>
  );
}

function LoadingGallery() {
  return (
    <Section title="Loading">
      <Loading size="sm" />
      <Loading size="md" />
      <Loading size="lg" />
    </Section>
  );
}

function ModalGallery() {
  const [open, setOpen] = useState(false);
  return (
    <Section title="Modal">
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="예시 모달"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>확인</Button>
          </>
        }
      >
        모달 본문 내용입니다.
      </Modal>
    </Section>
  );
}

function PaginationGallery() {
  const [page, setPage] = useState(1);
  return (
    <Section title="Pagination">
      <Pagination currentPage={page} totalPages={18} onPageChange={setPage} />
    </Section>
  );
}

function TableGallery() {
  const columns = [
    { key: "name", label: "이름" },
    {
      key: "role",
      label: "역할",
      render: (row) => (
        <Badge variant={row.role === "운영자" ? "info" : "neutral"}>
          {row.role}
        </Badge>
      ),
    },
  ];
  const data = [
    { id: 1, name: "홍길동", role: "일반회원" },
    { id: 2, name: "김철수", role: "운영자" },
  ];
  return (
    <Section title="Table">
      <Table columns={columns} data={data} />
    </Section>
  );
}

function ToastTrigger() {
  const showToast = useContext(ToastContext);
  return (
    <Section title="Toast">
      <Button onClick={() => showToast?.("저장되었습니다.", "success")}>
        success 토스트
      </Button>
      <Button
        variant="danger"
        onClick={() => showToast?.("오류가 발생했습니다.", "danger")}
      >
        danger 토스트
      </Button>
    </Section>
  );
}

/**
 * Header/Footer는 화면 폭을 그대로 써야 Figma와 비교가 되므로,
 * 아래 960px 제한 컨테이너 밖(전체 폭)에 따로 둔다.
 */
function LayoutGallery() {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          fontSize: "1.6rem",
          margin: "0 2.4rem 1.2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.6rem",
        }}
      >
        Header / Footer
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <Header user={null} />
        <Header
          user={{
            memberName: "김민지",
            role: "ROLE_USER",
            memberImgPath: null,
          }}
          onLogout={() => console.log("로그아웃 클릭 (프리뷰 mock)")}
        />
        <Header
          user={{
            memberName: "관리자",
            role: "ROLE_ADMIN",
            memberImgPath: null,
          }}
          onLogout={() => console.log("로그아웃 클릭 (프리뷰 mock)")}
        />
        <Footer />
      </div>
    </div>
  );
}

/**
 * 마이페이지는 로그인(T-5)이 없으면 실제 API가 401을 내서 빈 화면처럼 보인다.
 * 로그인 없이도 생김새를 볼 수 있도록, 실제 /mypage 와 똑같이
 * "셸(사이드바 + <Outlet>) + 개인정보 관리 탭" 전체를 mock 데이터로 그린다.
 *
 * MyPage.jsx(셸)는 useMember()로 진짜 API를 치므로 그대로 못 올린다 → 셸의
 * 마크업만 MyPage.styled.js의 export(PageWrap/SidebarWrap/...)를 재사용해
 * MyPageShellMock 으로 재현한다. 탭 페이지(ProfileEditPage)는 useOutletContext()로
 * member를 받으므로, 실제 <Outlet>이 하듯 <Routes>/<Route>로 한 번 더 감싸 context를
 * 흉내낸다. (main.jsx가 이미 <BrowserRouter>로 감싸고 있어서 여기서 또 Router를
 * 새로 만들면 "Router 안에 Router" 에러 → MemoryRouter 대신 같은 Router 위에
 * <Routes>만 하나 더 얹는다. 실제 주소가 "/"이므로 path="/"로 맞춘다.)
 * 사이드바 탭 링크는 전부 "/"로 걸어 프리뷰를 벗어나지 않게 하고, "개인정보 관리"만
 * 활성 상태로 표시한다. "저장하기" 등 실제 제출은 진짜 API를 치므로 여기선 성공하지
 * 않는다 — 레이아웃 확인용.
 */
const MYPAGE_NAV = [
  { key: "info", label: "개인정보 관리", icon: "👤" },
  { key: "allergy", label: "알러지 필터 관리", icon: "🛡️" },
  { key: "bookmark", label: "즐겨찾는 레시피", icon: "❤️" },
  { key: "recipes", label: "내 작성 레시피", icon: "📝" },
];

const MOCK_MEMBER = {
  memberId: "allergyout123",
  memberImgPath: null,
  memberName: "김민지",
  phone: "01012341234",
  email: "minji@allergy.com",
  createDate: "2024-03-15T00:00:00",
};

function MyPageShellMock() {
  return (
    <PageWrap>
      <SidebarWrap>
        <ProfileSummary>
          <Avatar
            name={MOCK_MEMBER.memberName}
            src={MOCK_MEMBER.memberImgPath}
            size="lg"
          />
          <ProfileName>{MOCK_MEMBER.memberName} 님</ProfileName>
          <ProfileEmail>{MOCK_MEMBER.email}</ProfileEmail>
        </ProfileSummary>

        <NavList>
          {MYPAGE_NAV.map((item) => (
            <NavItem key={item.key} to="/" $active={item.key === "info"}>
              <NavIcon aria-hidden="true">{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          ))}
        </NavList>
      </SidebarWrap>

      <Outlet context={{ member: MOCK_MEMBER, refetch: () => {} }} />
    </PageWrap>
  );
}

function MyPageGallery() {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          fontSize: "1.6rem",
          margin: "0 2.4rem 1.2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.6rem",
        }}
      >
        MyPage — /mypage 전체 모양 (mock 데이터, 로그인 불필요)
      </h2>
      <Routes>
        <Route path="/" element={<MyPageShellMock />}>
          <Route index element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </div>
  );
}

/**
 * 로그인 시험용 폼 — preview 전용 도구.
 * 실제 LoginPage(pages/auth/*)는 인증 담당이 T-5로 따로 만든다. 여기는 마이페이지 등
 * 회원 전용 화면을 "진짜 데이터"로 확인하려고 useAuth().login 을 직접 호출해보는 용도.
 *
 * 로그인 성공 → accessTokenStore(메모리)에 토큰 저장 → 새로고침 없이 /mypage 로 가면
 * useMember()가 실제 응답을 받는다. 새로고침하면 메모리 토큰은 날아가지만
 * AuthProvider 가 refresh 쿠키로 다시 부트스트랩한다.
 *
 * 아이디/비밀번호 필드명({ memberId, memberPwd })은 CLAUDE.md [API] 예시 기준 —
 * 로그인 명세가 확정되면 맞춰야 한다.
 */
function LoginTester() {
  const { user, isReady, login, logout } = useAuth();
  const showToast = useContext(ToastContext);
  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await login({ memberId, memberPwd });
      showToast?.(res?.msg || "로그인 성공", "success");
    } catch (err) {
      setError(err?.msg || "로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMemberId("");
    setMemberPwd("");
    showToast?.("로그아웃되었습니다.", "success");
  };

  return (
    <div style={{ marginBottom: "3rem", padding: "0 2.4rem" }}>
      <h2
        style={{
          fontSize: "1.6rem",
          margin: "0 0 1.2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.6rem",
        }}
      >
        로그인 (preview 시험용)
      </h2>

      {!isReady ? (
        <Loading size="sm" />
      ) : user ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            maxWidth: "360px",
          }}
        >
          <Alert variant="success">
            로그인됨 — {user.memberName} ({user.memberId})
            {user.role ? ` · ${user.role}` : ""}
          </Alert>
          <Button variant="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
          <p style={{ fontSize: "1.3rem", color: "#666" }}>
            이제 <a href="/mypage">/mypage</a> 로 이동하면 실제 데이터로
            렌더됩니다.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            maxWidth: "360px",
          }}
        >
          <Input
            label="아이디"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="memberId"
            autoComplete="username"
          />
          <Input
            label="비밀번호"
            type="password"
            value={memberPwd}
            onChange={(e) => setMemberPwd(e.target.value)}
            error={error}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            loading={submitting}
            disabled={!memberId || !memberPwd}
          >
            로그인
          </Button>
        </form>
      )}
    </div>
  );
}

export default function Preview() {
  return (
    <div>
      <LoginTester />
      <LayoutGallery />
      <MyPageGallery />
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2.4rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Common Components Gallery</h1>
        <ButtonGallery />
        <AvatarGallery />
        <BadgeGallery />
        <AlertGallery />
        <InputGallery />
        <LoadingGallery />
        <ModalGallery />
        <PaginationGallery />
        <TableGallery />
        <ToastTrigger />
      </div>
    </div>
  );
}
