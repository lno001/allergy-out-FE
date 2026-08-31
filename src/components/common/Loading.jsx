import { LoadingWrapper, LoadingSpinner } from '../../styles/common.styled';

/**
 * 로딩 스피너.
 *
 * props
 * - size      : 'sm' | 'md' | 'lg'  (기본 'md')
 * - fullscreen: boolean — true면 화면 전체를 반투명 흰 배경으로 덮고 중앙에 스피너
 *               (예: 페이지 최초 로딩, 폼 제출 중 화면 잠금). 기본 false
 * - label     : string — 스크린리더용 텍스트 (기본 '불러오는 중')
 *
 * @example
 * // 영역 로딩
 * {isLoading ? <Loading /> : <RecipeList data={data} />}
 *
 * // 제출 중 화면 잠금
 * {isSubmitting && <Loading fullscreen />}
 */
function Loading({ size = 'md', fullscreen = false, label = '불러오는 중' }) {
  return (
    <LoadingWrapper $fullscreen={fullscreen}>
      <LoadingSpinner $size={size} role="status" aria-label={label} />
      <span className="visually-hidden">{label}</span>
    </LoadingWrapper>
  );
}

export default Loading;
