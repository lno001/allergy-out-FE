import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Layout from "./components/layout/Layout";
import Preview from "./preview";
import AllergyManagePage from "./pages/mypage/allergy/AllergyManagePage";
import BookmarkListPage from "./pages/mypage/BookmarkListPage";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import RecipeCreatePage from "./pages/recipe/RecipeCreatePage";
import RecipeEditPage from "./pages/recipe/RecipeEditPage";
import RecipeListPage from "./pages/recipe/RecipeListPage";
import RecipeDetailPage from "./pages/recipe/RecipeDetailPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Preview />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/recipe/form" element={<RecipeCreatePage />} />
        <Route path="/recipe" element={<RecipeListPage />} />
        <Route path="/recipe/:recipeNo/edit" element={<RecipeEditPage />} />
        <Route path="/recipe/:recipeNo" element={<RecipeDetailPage />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<ProfileEditPage />} />
          <Route path="allergy" element={<AllergyManagePage />} />
          <Route path="bookmark" element={<BookmarkListPage />} />
        </Route>
        <Route path="*" element={<Preview />} />
      </Route>
    </Routes>
  );
}

export default App;
