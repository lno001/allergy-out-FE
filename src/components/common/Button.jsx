import { ButtonBase, ButtonSpinner } from "../../styles/common.styled";

/**
 * 서비스 전체에서 쓰는 공용 버튼.
 *
 * props
 * - variant  : 'primary' | 'secondary' | 'ghost' | 'warning' | 'danger' | 'dangerOutline'  (기본 'primary')
 * - size     : 'sm' | 'md' | 'lg'  (기본 'md')
 * - fullWidth: boolean — 가로 100% (기본 false)
 * - loading  : boolean — 스피너 표시 + 자동으로 클릭 차단 (기본 false)
 * - disabled : boolean (기본 false)
 * - type     : 'button' | 'submit' | 'reset'  (기본 'button' — <form> 제출 버튼은 type="submit" 필수)
 * - onClick  : 클릭 핸들러
 * - ...rest  : 그 외 네이티브 <button> 속성(aria-*, data-*, name 등) 그대로 전달
 * - children : 버튼 라벨
 *
 * 사용 규칙 (감사 결과 반영):
 * - 주요 확정 액션(저장/등록/로그인)은 항상 primary
 * - 취소/뒤로가기는 항상 secondary (primary와 같은 색 쓰지 않기)
 * - 삭제/탈퇴처럼 되돌릴 수 없는 액션은 danger 계열만 사용
 * - 리스트/테이블 안에서 반복되는 삭제 버튼은 dangerOutline 사용
 * - warning은 "소량 함유 가능성" 같은 주의 액션 전용
 *
 * @example
 * <Button onClick={handleSave}>저장</Button>
 * <Button variant="secondary" onClick={close}>취소</Button>
 * <Button type="submit" loading={isSubmitting}>로그인</Button>
 * <Button variant="dangerOutline" size="sm" onClick={() => remove(row)}>삭제</Button>
 * <Button fullWidth size="lg">가입하기</Button>
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...rest
}) {
  return (
    <ButtonBase
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <ButtonSpinner aria-hidden="true" />}
      {children}
    </ButtonBase>
  );
}

export default Button;
