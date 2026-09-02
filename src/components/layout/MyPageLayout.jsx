import Sidebar from "./Sidebar";
import { MyPageGrid } from "./layout.styled";

/**
 * 마이페이지 하위 화면 공통 뼈대 — 좌측 Sidebar + 우측 content.
 * 반응형: 768px 이하에서는 1열로 쌓임(layout.styled.js의 MyPageGrid 참고).
 */
function MyPageLayout({ children }) {
  return (
    <MyPageGrid>
      <Sidebar />
      <div>{children}</div>
    </MyPageGrid>
  );
}

export default MyPageLayout;
