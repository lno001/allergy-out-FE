import { AvatarCircle, AvatarImage } from "../../styles/common.styled";

/**
 * 서비스 전체 공용 아바타. 이미지가 있으면 이미지를, 없으면 이름 이니셜을 보여준다.
 * 예전엔 Header/사이드바/프로필카드/이미지모달 4곳에 각자 따로 구현돼 있던 걸 통합.
 *
 * props
 * - name  : string — 이니셜 fallback에 쓸 이름 (예: "김민지" → "김")
 * - src   : string|null — 프로필 이미지 URL. 없으면 이니셜로 대체
 * - size  : 'sm' | 'lg'  (기본 'sm')
 * - ...rest: aria-label 등 네이티브 속성 그대로 전달 (예: 계정 식별용 aria-label)
 *
 * @example
 * <Avatar name={member.memberName} src={member.memberImgPath} size="lg" />
 */
function Avatar({ name, src, size = "sm", ...rest }) {
  const initial = name ? name.charAt(0) : "";

  return (
    <AvatarCircle $size={size} {...rest}>
      {src ? <AvatarImage src={src} alt="" /> : <span aria-hidden="true">{initial}</span>}
    </AvatarCircle>
  );
}

export default Avatar;
