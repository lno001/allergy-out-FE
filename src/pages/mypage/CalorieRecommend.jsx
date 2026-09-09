import { useState } from "react";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import RecipeCard from "../../components/recipe/RecipeCard";
import { RecipeCardGrid } from "../../components/recipe/RecipeCard.styled";
import { getCalorieRecommendRecipes } from "../../apis/recipeApi";
import {
  ChartBlock,
  ChartTitle,
  EmptyNote,
  RecommendHint,
  RecommendRow,
} from "./RaspSection.styled";

/**
 * 소모 칼로리 측정 탭 하단 — "내 소모 칼로리에 맞는 레시피" 추천.
 *
 * totalCalories(오늘 총 소모 칼로리 추정 = 활동 + 기초대사량)를
 * GET /api/recipes/recommend/calorie 로 넘기면, 서버가 끼니당 목표(totalCalories/3)에
 * CALORIE 가 가까운 레시피를 최대 3개 준다 (알러지 재료 제외, 페이징 없음).
 * 응답 카드는 목록과 100% 동일 형태라 공용 RecipeCard 를 그대로 쓴다.
 *
 * @param {{ totalCalories: number }} props
 */
function CalorieRecommend({ totalCalories }) {
  const [recipes, setRecipes] = useState(null); // null=아직 안 받음 / []=결과 없음
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const target = Math.round(Number(totalCalories) || 0);
  const canRequest = target > 0 && target <= 10000; // 서버 제약과 동일하게 1차 검증

  const handleRecommend = async () => {
    if (!canRequest || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await getCalorieRecommendRecipes({ totalCalories: target });
      setRecipes(res?.data?.recipes ?? []);
    } catch (err) {
      // 인터셉터가 { code, msg, data, status } 로 reject
      setError(err?.msg ?? "추천 레시피를 불러오지 못했습니다.");
      setRecipes(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChartBlock>
      <ChartTitle>내 소모 칼로리에 맞는 레시피</ChartTitle>

      <RecommendRow>
        <RecommendHint>
          {canRequest ? (
            <>
              오늘 총 소모 칼로리 <strong>{target.toLocaleString()} kcal</strong> 기준,
              끼니당 약 {Math.round(target / 3).toLocaleString()} kcal에 가까운 레시피를
              찾아드려요.
            </>
          ) : (
            <>키·몸무게를 입력하면 소모 칼로리 기준으로 레시피를 추천받을 수 있어요.</>
          )}
        </RecommendHint>
        <Button
          size="sm"
          onClick={handleRecommend}
          loading={isLoading}
          disabled={!canRequest}
        >
          레시피 추천받기
        </Button>
      </RecommendRow>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <Loading label="추천 레시피를 불러오는 중" />
      ) : recipes === null ? null : recipes.length === 0 ? (
        <EmptyNote>조건에 맞는 추천 레시피가 없어요.</EmptyNote>
      ) : (
        <RecipeCardGrid>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.recipeNo} recipe={recipe} />
          ))}
        </RecipeCardGrid>
      )}
    </ChartBlock>
  );
}

export default CalorieRecommend;
