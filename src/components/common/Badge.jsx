import { BadgePill } from '../../styles/common.styled';

/**
 * 상태를 나타내는 작은 알약 모양 라벨. AllergyBadge와 달리 카테고리 색/아이콘이 없는
 * 범용 버전 — 관리자 테이블의 ROLE(일반회원/운영자/BAN), 탈퇴여부(Y/N) 같은 곳에서 씁니다.
 *
 * props
 * - variant : 'neutral' | 'success' | 'info' | 'danger' | 'dangerOutline'  (기본 'neutral')
 * - children: 라벨 텍스트
 *
 * 표시 전용입니다(onClick·className 등 추가 속성 전달 안 됨). 클릭이 필요하면 Button을 쓰세요.
 *
 * @example
 * <Badge variant={user.role === '운영자' ? 'info' : 'neutral'}>{user.role}</Badge>
 * <Badge variant="danger">BAN</Badge>
 * <Badge variant="success">활성</Badge>
 */
function Badge({ children, variant = 'neutral' }) {
  return <BadgePill $variant={variant}>{children}</BadgePill>;
}

export default Badge;
