/**
 * Allergy Out — 디자인 토큰
 * 색·타이포·간격·radius·shadow·z-index 등 모든 디자인 값의 단일 출처입니다.
 * 값은 여기서만 바꾸고, common.styled.js의 styled 컴포넌트는 이 토큰만 참조합니다.
 *
 * 사용: import { theme } from '../../styles/theme';  →  ${theme.color.primary}
 */

export const theme = {
  color: {
    // ---------- Primary — 브랜드 그린 (기본 액션 / 강조) ----------
    primary50: '#EFF9F1',
    primary100: '#DCF2E1',
    primary200: '#B7E4C4',
    primary: '#2FA766',
    primaryHover: '#1F8A52',
    primary700: '#166B40',
    primary800: '#0F4F30',

    // ---------- Caution — 주의/경고 액션 (호박색) ----------
    caution50: '#FEF6E7',
    caution100: '#FCE8C2',
    caution: '#E8A33D',
    cautionHover: '#C9821F',

    // ---------- Danger — 위험/에러/삭제, 알러지 표시 (코랄레드) ----------
    danger50: '#FDF2F2',
    danger100: '#FBE0E0',
    danger: '#E5484D',
    dangerHover: '#C93A3E',

    // ---------- Neutral — 따뜻한 톤의 그레이 ----------
    white: '#FFFFFF',
    gray50: '#FBF9F4',
    gray100: '#F2EFEA',
    gray200: '#E5E1D8',
    gray300: '#D6D0C4',
    gray400: '#A8A196',
    gray500: '#8A8580',
    gray600: '#6B655F',
    gray700: '#57534E',
    gray800: '#3D3A36',
    gray900: '#2B2A28',

    // ---------- Semantic (역할 기반 별칭) ----------
    text: '#2B2A28', // gray900
    sub: '#8A8580', // gray500, 보조 텍스트
    placeholder: '#A8A196', // gray400
    textOnPrimary: '#FFFFFF',
    danger600: '#C93A3E',
    caution600: '#C9821F',

    bgPage: '#FBF9F4', // gray50
    bg: '#FFFFFF', // 카드/서페이스 배경
    bgSoft: '#F2EFEA', // gray100, muted 배경

    border: '#D6D0C4', // gray300, 기본 테두리
    borderFocus: '#2FA766', // primary
    borderDanger: '#E5484D',

    // ---------- Overlay / Scrim ----------
    scrim: 'rgba(43, 42, 40, 0.5)', // 모달 backdrop — gray900(#2B2A28) 기반의 따뜻한 먹색
    overlayLight: 'rgba(255, 255, 255, 0.72)', // fullscreen 로딩 오버레이

    // ---------- Info — 안내 (파랑), Alert/Badge 전용 ----------
    info: '#3B82F6',
    infoBg: '#EAF2FC',
    infoBorder: '#D3E5FA',
    infoText: '#1D4ED8',
  },

  fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif",

  fontSize: {
    xs: '1.2rem', // 12px
    sm: '1.4rem', // 14px
    md: '1.6rem', // 16px, 기본 본문
    lg: '1.8rem', // 18px
    xl: '2.2rem', // 22px
    '2xl': '2.8rem', // 28px
    '3xl': '3.6rem', // 36px
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.3,
    base: 1.5,
    loose: 1.7,
  },

  // ---------- Spacing scale (4px 기준) ----------
  space: {
    xs: '0.4rem', // 4px
    sm: '0.8rem', // 8px
    md: '1.2rem', // 12px
    lg: '1.6rem', // 16px
    xl: '2.0rem', // 20px
    '2xl': '2.4rem', // 24px
    '3xl': '3.2rem', // 32px
    '4xl': '4.0rem', // 40px
    '5xl': '4.8rem', // 48px
    '6xl': '6.4rem', // 64px
  },

  // ---------- Radius ----------
  radius: {
    sm: '8px', // 뱃지, 태그, 작은 버튼
    md: '12px', // 기본 버튼, input
    lg: '20px', // 카드, 모달
    xl: '28px', // 배너, 큰 컨테이너
    full: '999px', // 아바타, 원형 아이콘, 뱃지 pill
  },

  // ---------- Shadow ----------
  shadow: {
    sm: '0 1px 3px rgba(43, 42, 40, 0.06)',
    md: '0 8px 20px rgba(43, 42, 40, 0.08)',
    lg: '0 16px 32px rgba(43, 42, 40, 0.14)',
    primary: '0 8px 20px rgba(31, 138, 82, 0.24)',
    primaryHover: '0 10px 24px rgba(31, 138, 82, 0.3)',
  },

  // ---------- Transition ----------
  transition: {
    fast: '0.15s ease',
    base: '0.2s ease',
  },

  // ---------- Z-index scale ----------
  zIndex: {
    header: 100,
    dropdown: 200,
    modalBackdrop: 900,
    modal: 1000,
    overlay: 1050, // fullscreen 로딩 락 — 모달 위, 토스트 아래
    toast: 1100,
  },
};
