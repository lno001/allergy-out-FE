import { Routes, Route } from "react-router-dom";

import Preview from "./preview";

import RecipeCreatePage from "./pages/recipe/RecipeCreatePage";

/**
 * 실제 페이지 라우팅이 붙기 전까지, 모든 경로에서 공통 컴포넌트 갤러리(preview)를 보여줍니다.
 * 페이지가 생기면 여기에 <Route> 를 추가하세요.
 */
function App() {
  return (
    <Routes>
      <Route path="" element={<Preview />} />
      <Route path="/recipe" element={<RecipeCreatePage />} />
    </Routes>
  );
}

export default App;
