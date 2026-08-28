import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

/**
 * 앱 전역 스타일 — CSS 리셋 + document/body 기본값 + 유틸리티 클래스.
 * main.jsx / preview.jsx 최상단에서 <GlobalStyle />로 한 번만 렌더링합니다.
 *
 * 개별 컴포넌트 스타일은 common.styled.js에 있습니다.
 * 여기에는 특정 컴포넌트에 속하지 않는 전역 규칙만 둡니다.
 */

const GlobalStyle = createGlobalStyle`
  /* Pretendard 가변 폰트 (CDN). 프로덕션에선 로컬 설치 권장. */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px 기준, theme.js의 rem 값과 매칭 */
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize.md};
    font-weight: ${theme.fontWeight.regular};
    line-height: ${theme.lineHeight.base};
    color: ${theme.color.text};
    background-color: ${theme.color.bgPage};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  :focus-visible {
    outline: 2px solid ${theme.color.borderFocus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: ${theme.space['2xl']};
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export default GlobalStyle;
