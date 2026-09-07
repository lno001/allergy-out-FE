/**
 * 회원 입력값 검증 — BE ↔ FE 공유 규격.
 *
 * 출처: "회원 입력값 검증 규격 (BE ↔ FE 공유)" 문서. 회원가입과 회원정보수정의 같은 필드는 규칙이 100% 동일.
 * 정규식·메시지는 BE 가 400 응답으로 주는 것과 동일하게 유지한다 (여기서 창작하지 않음).
 *
 * 3층 구조:
 * 1. sanitize*  — onChange 실시간 하드 차단(금지문자가 아예 안 쳐짐). 그에 대한 에러는 나올 일이 없다.
 * 2. validate*  — 제출 시 RULES 대입 → 위반이면 MESSAGES 문구를 필드 밑에 표시(서버 왕복 전 즉시).
 * 3. 서버 400   — 그래도 최종 판정은 서버. data:{ 필드: msg } 를 그대로 받아 덮어씀(getFieldErrors/splitFormError).
 *
 * FE 전용 예외 1개: PASSWORD_CONFIRM_MISMATCH — 서버가 "비밀번호 확인" 필드를 안 받아 서버가 알려줄 수 없음.
 */

/* ── 정규식 (BE Java 와 동일하게 동작하는 JS 리터럴) ── */
export const RULES = {
  memberId: /^[a-z0-9]{4,20}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]{8,30}$/,
  memberName: /^[가-힣A-Za-z]{2,30}$/,
  phone: /^010[0-9]{8}$/,
  email:
    /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,255}\.[A-Za-z]{2,24}$/,
};

/** 이메일 전체 길이(local + "@" + domain) 상한. 정규식과 별개로 본다. */
export const EMAIL_MAX = 50;

/** 입력창 maxLength (초과 입력 자체를 막는다). 최소 길이는 여기 없음 — validate* / 서버가 본다. */
export const MEMBER_MAX = {
  memberId: 20,
  memberPwd: 30, // 규칙 8~30자 (특수문자 허용, 공백 불가)
  memberName: 30,
  phoneLocal: 8, // "010" 제외 뒤 8자리
};

const PASSWORD_FORMAT_MSG =
  "비밀번호는 영문, 숫자를 포함하여 8자 이상 30자 이하로 입력해주세요. (특수문자 사용 가능, 공백 불가)";

/** BE 가 400 으로 주는 문구와 동일하게 유지. empty = 값 없음, format = 형식 위반. */
export const MESSAGES = {
  memberId: {
    empty: "아이디를 입력해주세요.",
    format: "아이디는 영문 소문자, 숫자로 4자 이상 20자 이하로 입력해주세요.",
  },
  memberPwd: {
    empty: "비밀번호를 입력해주세요.",
    format: PASSWORD_FORMAT_MSG,
  },
  newPassword: {
    empty: "새 비밀번호를 입력해주세요.",
    format: PASSWORD_FORMAT_MSG,
  },
  currentPassword: {
    empty: "기존 비밀번호를 입력해주세요.",
  },
  memberName: {
    empty: "이름을 입력해주세요.",
    format: "이름은 공백 없이 한글, 영문 2자 이상 30자 이하로 입력해주세요.",
  },
  phone: {
    empty: "연락처를 입력해주세요.",
    format: "올바른 연락처 형식이 아닙니다.",
  },
  email: {
    empty: "이메일을 입력해주세요.",
    format: "올바른 이메일 형식이 아닙니다.",
  },
};

/**
 * FE 만 판정하는 유일한 문구. 서버는 "비밀번호 확인" 필드를 받지 않는다.
 */
export const PASSWORD_CONFIRM_MISMATCH = "비밀번호가 일치하지 않습니다.";

/** placeholder 용 짧은 안내 (에러 메시지 아님, UI 카피). */
export const MEMBER_HINT = {
  memberId: "영문 소문자·숫자 4~20자",
  memberPwd: "영문·숫자 포함 8~30자 (특수문자 가능, 공백 불가)",
  memberName: "공백 없이 한글·영문 2~30자",
  phone: "뒤 8자리 숫자",
};

/* ── sanitize: onChange 실시간 하드 차단 ── */

/** 아이디: 영문 소문자 + 숫자만. 대문자는 소문자로 내려 준다. */
export const sanitizeMemberId = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** 숫자만 남긴다 (전화). */
export const sanitizeDigits = (value) => value.replace(/\D/g, "");

/** 공백만 제거 (이메일 — 문자셋/형식은 validateEmail + 서버가 판정). */
export const sanitizeEmail = (value) => value.replace(/\s/g, "");

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

/** 이메일 두 칸을 한 주소로. 형식 판정은 안 한다. */
export const buildEmail = (local, domain) => `${local.trim()}@${domain.trim()}`;

/* ── validate: 제출 시 RULES 대입 → 위반 메시지("") ── */

/**
 * 값 하나를 규칙에 대입해 위반 메시지를 돌려준다. 정상이면 "".
 * @param {"memberId"|"memberPwd"|"newPassword"|"currentPassword"|"memberName"} fieldKey
 * @param {string} value - 이미 trim 등 필요한 가공을 마친 값 (여기서 trim 하지 않음 — 비번 공백 보존)
 */
export function validateMemberField(fieldKey, value) {
  const rule = MESSAGES[fieldKey];
  if (!value) return rule.empty;

  switch (fieldKey) {
    case "memberId":
      return RULES.memberId.test(value) ? "" : rule.format;
    case "memberPwd":
    case "newPassword":
      return RULES.password.test(value) ? "" : rule.format;
    case "memberName":
      return RULES.memberName.test(value) ? "" : rule.format;
    case "currentPassword":
      return ""; // 빈값만 본다 (해시 대조는 서버)
    default:
      return "";
  }
}

/**
 * 전화 뒤 8자리 → 위반 메시지. 정상이면 "".
 * @param {string} local8 - "010" 을 뺀 숫자 8자리
 */
export function validatePhone(local8) {
  const digits = local8 ?? "";
  if (!digits) return MESSAGES.phone.empty;
  return RULES.phone.test(`010${digits}`) ? "" : MESSAGES.phone.format;
}

/**
 * 이메일 두 칸 → 위반 메시지. 정상이면 "".
 * @param {string} local
 * @param {string} domain
 */
export function validateEmail(local, domain) {
  if (!local.trim() || !domain.trim()) return MESSAGES.email.empty;
  const full = buildEmail(local, domain);
  if (full.length > EMAIL_MAX || !RULES.email.test(full)) {
    return MESSAGES.email.format;
  }
  return "";
}

/**
 * 회원가입 폼 전체 검증 → { 필드: 메시지 } (위반 없으면 빈 객체).
 * @param {{ memberId: string, memberPwd: string, memberPwdCheck: string,
 *           memberName: string, phone: string, emailId: string, emailDomain: string }} form
 */
export function validateSignupForm(form) {
  const errors = {};

  const idMsg = validateMemberField("memberId", form.memberId.trim());
  if (idMsg) errors.memberId = idMsg;

  const pwMsg = validateMemberField("memberPwd", form.memberPwd);
  if (pwMsg) {
    errors.memberPwd = pwMsg;
  } else if (form.memberPwd !== form.memberPwdCheck) {
    errors.memberPwdCheck = PASSWORD_CONFIRM_MISMATCH;
  }

  const nameMsg = validateMemberField("memberName", form.memberName.trim());
  if (nameMsg) errors.memberName = nameMsg;

  const phoneMsg = validatePhone(form.phone);
  if (phoneMsg) errors.phone = phoneMsg;

  const emailMsg = validateEmail(form.emailId, form.emailDomain);
  if (emailMsg) errors.email = emailMsg;

  return errors;
}
