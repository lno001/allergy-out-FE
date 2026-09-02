import { AvatarCircle, AvatarImage } from "../../styles/common.styled";

/**
 * 서비스 전체 공용 아바타.
 * 프로필 이미지가 있으면 이미지를, 없으면 공용 기본 아이콘(사람 실루엣)을 보여준다.
 * 이름 이니셜 fallback은 쓰지 않는다 — 사진 없는 회원은 전부 같은 기본 아이콘으로 통일.
 *
 * props
 * - name  : string — 접근성 라벨용 이름. aria-label 을 따로 안 주면 "○○님 프로필"로 쓰인다 (화면엔 안 보임)
 * - src   : string|null — 프로필 이미지 URL. 없으면 기본 아이콘
 * - size  : 'sm' | 'lg'  (기본 'sm')
 * - ...rest: aria-label 등 네이티브 속성 그대로 전달 (rest가 우선)
 *
 * @example
 * <Avatar name={user.memberName} src={user.memberImgPath} size="sm" />
 */
function Avatar({ name, src, size = "sm", ...rest }) {
  return (
    <AvatarCircle
      $size={size}
      role="img"
      aria-label={name ? `${name}님 프로필` : "프로필"}
      {...rest}
    >
      {src ? (
        <AvatarImage src={src} alt="" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="62%"
          height="62%"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2.5c-4.694 0-8.5 2.462-8.5 5.5V21h17v-1c0-3.038-3.806-5.5-8.5-5.5Z" />
        </svg>
      )}
    </AvatarCircle>
  );
}

export default Avatar;
