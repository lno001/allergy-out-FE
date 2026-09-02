import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Layout from "./components/layout/Layout";
import Preview from "./preview";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import RecipeCreatePage from "./pages/recipe/RecipeCreatePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Preview />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/recipe" element={<RecipeCreatePage />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<ProfileEditPage />} />
        </Route>
        <Route path="*" element={<Preview />} />
      </Route>
    </Routes>
  );
}

export default App;
