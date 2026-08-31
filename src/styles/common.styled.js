import styled, { css, keyframes } from 'styled-components';
import { theme } from './theme';

/**
 * common.styled.js
 * ------------------------------------------------------------------------
 * components/common/*.jsx 가 사용하는 styled 컴포넌트를 한곳에 모았습니다.
 * 컴포넌트별로 구간(=== 배너 ===)을 나눠 두었고, variant/size 처럼 조건에 따라
 * 달라지는 값은 $variant, $size 같은 transient prop($ 접두사)으로 받습니다.
 * ($ 접두사 prop은 실제 DOM으로 내려가지 않아 콘솔 경고가 없습니다.)
 *
 * JSX·props 처리는 각 components/common/*.jsx 에 있고, 여기서는 "모양"만 담당합니다.
 * 디자인 값은 전부 theme.js 토큰을 참조합니다 (하드코딩 금지).
 * ------------------------------------------------------------------------
 */

/* ============================================================
   Keyframes — 스피너 회전 / 토스트 등장 (여러 컴포넌트 공용)
   ============================================================ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const toastSlideIn = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/* ============================================================
   Button — 서비스 전체 공용 버튼
   variant: primary | secondary | ghost | warning | danger | dangerOutline
   size: sm | md | lg
   ============================================================ */

const BUTTON_VARIANT_STYLES = {
  primary: css`
    background-color: ${theme.color.primary};
    color: ${theme.color.textOnPrimary};
    box-shadow: ${theme.shadow.primary};
    &:hover:not(:disabled) {
      background-color: ${theme.color.primaryHover};
      transform: translateY(-1px);
      box-shadow: ${theme.shadow.primaryHover};
    }
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background-color: ${theme.color.white};
    color: ${theme.color.text};
    border-color: ${theme.color.border};
    &:hover:not(:disabled) {
      background-color: ${theme.color.bgSoft};
      border-color: ${theme.color.gray400};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.color.primaryHover};
    border-color: ${theme.color.primary200};
    &:hover:not(:disabled) {
      background-color: ${theme.color.primary50};
    }
  `,
  warning: css`
    background-color: ${theme.color.caution};
    color: ${theme.color.textOnPrimary};
    &:hover:not(:disabled) {
      background-color: ${theme.color.cautionHover};
    }
  `,
  danger: css`
    background-color: ${theme.color.danger};
    color: ${theme.color.textOnPrimary};
    &:hover:not(:disabled) {
      background-color: ${theme.color.dangerHover};
    }
  `,
  dangerOutline: css`
    background-color: ${theme.color.white};
    color: ${theme.color.danger600};
    border-color: ${theme.color.danger100};
    &:hover:not(:disabled) {
      background-color: ${theme.color.danger50};
    }
  `,
};

const BUTTON_SIZE_STYLES = {
  sm: css`
    height: 36px;
    padding-inline: ${theme.space.lg};
    font-size: ${theme.fontSize.sm};
  `,
  md: css`
    height: 44px;
    padding-inline: ${theme.space.xl};
    font-size: ${theme.fontSize.md};
  `,
  lg: css`
    height: 52px;
    padding-inline: ${theme.space['2xl']};
    font-size: ${theme.fontSize.lg};
  `,
};

export const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
  font-family: ${theme.fontFamily};
  font-weight: ${theme.fontWeight.semibold};
  border-radius: ${theme.radius.md};
  border: 1.5px solid transparent;
  white-space: nowrap;
  transition: background-color ${theme.transition.fast}, border-color ${theme.transition.fast},
    color ${theme.transition.fast}, opacity ${theme.transition.fast}, transform ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  ${({ $size }) => BUTTON_SIZE_STYLES[$size] || BUTTON_SIZE_STYLES.md}
  ${({ $variant }) => BUTTON_VARIANT_STYLES[$variant] || BUTTON_VARIANT_STYLES.primary}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ButtonSpinner = styled.span`
  width: 1em; /* 버튼 size(sm/md/lg)의 font-size에 맞춰 스피너도 같이 커지도록 */
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

/* ============================================================
   Input — 서비스 전체 공용 입력창
   흰 배경 + 회색 테두리로 통일. error가 있으면 빨간 테두리로 전환.
   ============================================================ */

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  width: 100%;
`;

export const InputLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
`;

export const InputLabel = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.color.text};
`;

export const InputRequiredMark = styled.span`
  color: ${theme.color.danger};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding-inline: ${theme.space.lg};
  background-color: ${theme.color.white};
  border: 1.5px solid ${({ $hasError }) => ($hasError ? theme.color.borderDanger : theme.color.border)};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  transition: border-color ${theme.transition.fast};

  &::placeholder {
    color: ${theme.color.placeholder};
  }

  &:hover:not(:disabled) {
    border-color: ${theme.color.gray400};
  }

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? theme.color.borderDanger : theme.color.borderFocus)};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? theme.color.danger50 : theme.color.primary50)};
  }

  &:disabled {
    background-color: ${theme.color.bgSoft};
    color: ${theme.color.sub};
    cursor: not-allowed;
  }
`;

export const InputSuffixButton = styled.span`
  position: absolute;
  right: ${theme.space.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.color.sub};
`;

export const InputHelperText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const InputErrorText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger600};
`;

/* ============================================================
   Loading — 스피너
   size: sm | md | lg / fullscreen: 전체 화면 덮는 로딩 오버레이
   ============================================================ */

const LOADING_SIZE_STYLES = {
  sm: css`
    width: 2rem;
    height: 2rem;
    border-width: 2px;
  `,
  md: css`
    width: 3.6rem;
    height: 3.6rem;
    border-width: 3px;
  `,
  lg: css`
    width: 5.2rem;
    height: 5.2rem;
    border-width: 4px;
  `,
};

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $fullscreen }) => $fullscreen && css`
    position: fixed;
    inset: 0;
    background-color: ${theme.color.overlayLight};
    z-index: ${theme.zIndex.overlay};
  `}
`;

export const LoadingSpinner = styled.div`
  border-radius: 50%;
  border-style: solid;
  border-color: ${theme.color.primary100};
  border-top-color: ${theme.color.primary};
  animation: ${spin} 0.7s linear infinite;

  ${({ $size }) => LOADING_SIZE_STYLES[$size] || LOADING_SIZE_STYLES.md}
`;

/* ============================================================
   Modal — 다이얼로그 껍데기 (이름/비밀번호 변경, 탈퇴 등에서 공용)
   size: sm | md | lg
   ============================================================ */

const MODAL_SIZE_STYLES = {
  sm: css`max-width: 400px;`,
  md: css`max-width: 500px;`,
  lg: css`max-width: 680px;`,
};

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${theme.color.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.space.lg};
  z-index: ${theme.zIndex.modalBackdrop};
`;

export const ModalBox = styled.div`
  width: 100%;
  background-color: ${theme.color.bg};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.lg};
  z-index: ${theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  max-height: 90vh;

  ${({ $size }) => MODAL_SIZE_STYLES[$size] || MODAL_SIZE_STYLES.sm}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.space.xl} ${theme.space['2xl']};
  border-bottom: 1px solid ${theme.color.gray100};
`;

export const ModalTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.radius.full};
  color: ${theme.color.sub};
  transition: background-color ${theme.transition.fast};

  &:hover {
    background-color: ${theme.color.gray100};
  }
`;

export const ModalBody = styled.div`
  padding: ${theme.space['2xl']};
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.md};
  padding: ${theme.space.xl} ${theme.space['2xl']};
  border-top: 1px solid ${theme.color.gray100};
`;

/* ============================================================
   Pagination — 그룹(5개씩) 단위 페이지네이션
   ============================================================ */

export const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding-inline: ${theme.space.sm};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.sm};

  ${({ $active }) => ($active
    ? css`
      background-color: ${theme.color.primary};
      color: ${theme.color.textOnPrimary};
      font-weight: ${theme.fontWeight.semibold};
    `
    : css`
      color: ${theme.color.sub};
      background-color: ${theme.color.bgSoft};
      &:hover:not(:disabled) {
        background-color: ${theme.color.gray200};
      }
    `)}
`;

export const GroupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  color: ${theme.color.sub};

  &:hover {
    color: ${theme.color.text};
  }
`;

/* ============================================================
   Table — 관리자 회원목록/레시피목록 등에서 쓰는 공용 테이블
   ============================================================ */

export const TableWrapper = styled.div`
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.gray200};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeaderRow = styled.tr`
  background-color: ${theme.color.bgSoft};
  border-bottom: 1px solid ${theme.color.gray200};
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${theme.space.lg} ${theme.space.xl};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.text};
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.color.gray100};
  transition: background-color ${theme.transition.fast};

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${theme.color.bgSoft};
  }
`;

export const TableCell = styled.td`
  padding: ${theme.space.lg} ${theme.space.xl};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
  vertical-align: middle;
`;

export const TableEmptyState = styled.div`
  padding: ${theme.space['6xl']} 0;
  text-align: center;
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
`;

export const TablePaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.space.xl} 0;
  border-top: 1px solid ${theme.color.gray100};
`;

/* ============================================================
   Alert — 페이지/폼에 고정으로 붙는 안내 배너
   variant: success | danger | warning | info
   ============================================================ */

const ALERT_VARIANT_STYLES = {
  success: css`
    background-color: ${theme.color.primary50};
    border-color: ${theme.color.primary200};
    border-left-color: ${theme.color.primary};
    color: ${theme.color.primary800};
  `,
  danger: css`
    background-color: ${theme.color.danger50};
    border-color: ${theme.color.danger100};
    border-left-color: ${theme.color.danger};
    color: ${theme.color.danger600};
  `,
  warning: css`
    background-color: ${theme.color.caution50};
    border-color: ${theme.color.caution100};
    border-left-color: ${theme.color.caution};
    color: ${theme.color.caution600};
  `,
  info: css`
    background-color: ${theme.color.infoBg};
    border-color: ${theme.color.infoBorder};
    border-left-color: ${theme.color.info};
    color: ${theme.color.infoText};
  `,
};

// variant → 아이콘 글리프 & 아이콘 배경색 (Alert / Toast가 공유)
export const VARIANT_ICON = { success: '✓', danger: '✕', warning: '!', info: 'i' };

export const VARIANT_ICON_BG = {
  success: theme.color.primary,
  danger: theme.color.danger,
  warning: theme.color.caution,
  info: theme.color.info,
};

export const AlertBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.space.md};
  padding: ${theme.space.lg} ${theme.space.xl};
  border-radius: ${theme.radius.md};
  border: 1px solid transparent;
  border-left-width: 4px;
  font-size: ${theme.fontSize.sm};
  line-height: ${theme.lineHeight.base};

  ${({ $variant }) => ALERT_VARIANT_STYLES[$variant] || ALERT_VARIANT_STYLES.info}
`;

export const AlertIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: ${theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.white};
  background-color: ${({ $variant }) => VARIANT_ICON_BG[$variant] || VARIANT_ICON_BG.info};
`;

export const AlertMessage = styled.span`
  flex: 1;
  padding-top: 1px;
`;

export const AlertCloseButton = styled.button`
  flex-shrink: 0;
  color: inherit;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

/* ============================================================
   Badge — 작은 알약 모양 상태 라벨 (관리자 테이블의 ROLE, 탈퇴여부 등)
   variant: neutral | info | success | danger | dangerOutline
   ============================================================ */

const BADGE_VARIANT_STYLES = {
  neutral: css`
    background-color: ${theme.color.white};
    color: ${theme.color.sub};
    border-color: ${theme.color.gray300};
  `,
  info: css`
    background-color: ${theme.color.info};
    color: ${theme.color.white};
  `,
  success: css`
    background-color: ${theme.color.primary50};
    color: ${theme.color.primary700};
    border-color: ${theme.color.primary200};
  `,
  danger: css`
    background-color: ${theme.color.danger};
    color: ${theme.color.white};
  `,
  dangerOutline: css`
    background-color: ${theme.color.danger50};
    color: ${theme.color.danger600};
    border-color: ${theme.color.danger100};
  `,
};

export const BadgePill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding-inline: ${theme.space.md};
  border-radius: ${theme.radius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
  white-space: nowrap;
  border: 1px solid transparent;

  ${({ $variant }) => BADGE_VARIANT_STYLES[$variant] || BADGE_VARIANT_STYLES.neutral}
`;

/* ============================================================
   Toast — ToastProvider가 화면 우하단에 띄우는 알림
   variant: success | danger | warning | info (Alert와 동일한 팔레트 재사용)
   ============================================================ */

export const ToastContainer = styled.div`
  position: fixed;
  bottom: ${theme.space['2xl']};
  right: ${theme.space['2xl']};
  z-index: ${theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  pointer-events: none;
`;

export const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  min-width: 280px;
  max-width: 360px;
  padding: ${theme.space.lg} ${theme.space.xl};
  border-radius: ${theme.radius.md};
  background-color: ${theme.color.gray900};
  color: ${theme.color.white};
  font-size: ${theme.fontSize.sm};
  box-shadow: ${theme.shadow.lg};
  pointer-events: auto;
  animation: ${toastSlideIn} 0.2s ease;
`;

export const ToastIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: ${theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.color.white};
  background-color: ${({ $variant }) => VARIANT_ICON_BG[$variant] || VARIANT_ICON_BG.info};
`;
