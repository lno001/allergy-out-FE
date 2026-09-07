/**
 * 회원 입력값 제약 — FE 하드 차단 + 공유 상수.
 *
 * 역할: FE 는 sanitize*(onChange 실시간 차단) + maxLength + 필수값 게이트만 한다.
 * 길이·형식 위반의 "메시지"는 FE 가 만들지 않는다 — 제출 → 서버 400 { code, msg, data:{ 필드: msg } }
 * 를 getFieldErrors / splitFormError 로 받아 그대로 표시한다.
 * 유일한 FE 판정: PASSWORD_CONFIRM_MISMATCH (서버가 "비밀번호 확인" 필드를 안 받음).
 *
 * 규칙 숫자 출처: "회원 입력값 검증 규격 (BE ↔ FE 공유)" 문서.
 * - memberId  : ^[a-z0-9]{4,20}$
 * - password  : 영문+숫자 포함 8~30자, 특수문자 허용(공백 불가)
 * - memberName: ^[가-힣A-Za-z]{2,30}$ (공백 불가)
 * - phone     : ^010[0-9]{8}$
 * - email     : 로컬@도메인.TLD, 전체 길이 ≤ 50
 */

/** 입력창 maxLength (초과 입력 자체 차단). 최소 길이·형식은 서버가 본다. */
export const MEMBER_MAX = {
  memberId: 20,
  memberPwd: 30,
  memberName: 30,
  phoneLocal: 8, // "010" 을 제외한 뒤 8자리
};

/** 이메일 각 칸(로컬/도메인) maxLength. 합산 50자 초과는 서버 400 이 알려준다. */
export const EMAIL_MAX = 50;

/** 입력칸 placeholder 로 넣는 짧은 규칙 안내 (에러 메시지 아님, FE UI 카피). */
export const MEMBER_HINT = {
  memberId: "영문 소문자·숫자 4~20자",
  memberPwd: "영문·숫자 포함 8~30자, 공백 불가",
  memberName: "공백 없이 한글·영문 2~30자",
  phone: "뒤 8자리 숫자",
};

/** 서버가 "비밀번호 확인" 필드를 받지 않아 FE 만 판정하는 유일한 문구. */
export const PASSWORD_CONFIRM_MISMATCH = "비밀번호가 일치하지 않습니다.";

/* ── sanitize: onChange 실시간 하드 차단. 조합(IME) 처리는 hooks/useSanitizedChange 가 담당. ── */

/** 아이디: 영문 소문자 + 숫자만. 대문자는 소문자로 내려 준다. */
export const sanitizeMemberId = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** 숫자만 남긴다 (전화). */
export const sanitizeDigits = (value) => value.replace(/\D/g, "");

/** 이메일 로컬파트: BE 규격의 허용문자만(영숫자 . _ % + -). 한글·공백·그 외 기호 제거. */
export const sanitizeEmailLocal = (value) =>
  value.replace(/[^A-Za-z0-9._%+-]/g, "");

/** 이메일 도메인파트: BE 규격의 허용문자만(영숫자 . -). 한글·공백·그 외 기호 제거. */
export const sanitizeEmailDomain = (value) =>
  value.replace(/[^A-Za-z0-9.-]/g, "");

/**
 * "010xxxxxxxx"(11자리 이상)를 붙여넣거나 이어 치면 앞 010을 떼고, 숫자만 8자리로 자른다.
 * 8자리 이하(예: "01012345")는 뒤 8자리로 해석해 그대로 둔다 — 010-0101-2345 처럼 실제 번호일 수 있어서다.
 */
export const toPhoneLocal = (value) => {
  let digits = sanitizeDigits(value);
  if (digits.length >= 11 && digits.startsWith("010")) {
    digits = digits.slice(3);
  }
  return digits.slice(0, MEMBER_MAX.phoneLocal);
};

/** 이메일 두 칸(로컬 / 도메인)을 한 주소로 합친다. 두 칸은 sanitizeEmail* 로 이미 공백이 없다. */
export const buildEmail = (local, domain) => `${local}@${domain}`;
