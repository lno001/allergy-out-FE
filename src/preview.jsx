import { useContext, useState } from "react";

import Alert from "./components/common/Alert";
import Badge from "./components/common/Badge";
import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Loading from "./components/common/Loading";
import Modal from "./components/common/Modal";
import Pagination from "./components/common/Pagination";
import Table from "./components/common/Table";
import { ToastContext } from "./components/common/ToastProvider";

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

export default function Preview() {
  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2.4rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Common Components Gallery</h1>
      <ButtonGallery />
      <BadgeGallery />
      <AlertGallery />
      <InputGallery />
      <LoadingGallery />
      <ModalGallery />
      <PaginationGallery />
      <TableGallery />
      <ToastTrigger />
    </div>
  );
}
