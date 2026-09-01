import { Routes, Route } from "react-router-dom";

import AllergyManagePage from "./pages/mypage/AllergyManagePage";
import Preview from "./preview";

/**
 * 실제 페이지 라우팅이 붙기 전까지, 모든 경로에서 공통 컴포넌트 갤러리(preview)를 보여줍니다.
 * 페이지가 생기면 여기에 <Route> 를 추가하세요.
 *
 * /mypage/allergy는 원래 인증 필요(로그인 회원 전용) 화면이지만, PrivateRoute(T-5)가
 * 아직 없어서 지금은 가드 없이 연결만 해둠 — 로그인 안 한 상태로 들어가면 401 나고
 * axiosInstance 인터셉터가 /login으로 보냄.
 */
function App() {
  return (
    <Routes>
      <Route path="" element={<Preview />} />
      <Route path="/mypage/allergy" element={<AllergyManagePage />} />
    </Routes>
  );
}

export default App;
