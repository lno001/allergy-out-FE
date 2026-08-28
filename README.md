# Allergy Out — Design System Base

React + Vite 프론트엔드의 공통 토대입니다. API 호출 계층, 인증 토큰 처리,
공통 UI 컴포넌트(모양 중심)를 담습니다.

## 스택

- React 18 + Vite 5
- styled-components 6 (CSS-in-JS)
- axios (API 클라이언트)
- react-router-dom (라우팅 — 현재 `App.jsx`는 자리표시자)

## 폴더 구조

```
src/
├── apis/
│   ├── axiosInstance.js   # 공용 axios 인스턴스 + 인증(401 재발급) 인터셉터
│   ├── authApi.js         # 로그인 / 회원가입 / 로그아웃
│   ├── memberApi.js       # 내 정보 조회·수정, 비밀번호 변경, 탈퇴
│   ├── adminApi.js        # [관리자] 회원 목록 / 역할 변경
│   ├── allergyApi.js      # 알러젠 목록, 내 알러지 프로필
│   ├── bookmarkApi.js     # 북마크 목록 / 등록 / 삭제
│   └── recipeApi.js       # 레시피 CRUD
├── components/common/     # 공통 UI 컴포넌트 (모양만, 도메인 로직 없음)
│   ├── Button.jsx  Input.jsx  Modal.jsx  Loading.jsx
│   ├── Alert.jsx   Badge.jsx  Pagination.jsx  Table.jsx
│   └── ToastProvider.jsx
├── styles/
│   ├── theme.js           # 디자인 토큰 (색·타이포·간격·radius·shadow·z-index)
│   ├── GlobalStyle.js     # 전역 CSS 리셋 + body 기본값 + 유틸 클래스
│   └── common.styled.js   # components/common 이 쓰는 styled 컴포넌트 모음
├── App.jsx                # 라우팅 자리표시자
├── main.jsx               # 앱 엔트리 (GlobalStyle + ToastProvider + App)
└── preview.jsx            # 컴포넌트 갤러리 (preview.html 로 실행)
```

## 실행

```bash
npm install
npm run dev              # index.html → main.jsx (앱)
npm run preview:gallery  # preview.html → preview.jsx (컴포넌트 갤러리)
npm run build
```

`.env` 에 API 주소를 지정합니다:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## API 계층

모든 요청은 `apis/axiosInstance.js` 를 통해 나갑니다.

- **응답은 `response.data` 로 언랩**됩니다. `await getRecipe(id)` 의 결과가 곧 서버
  payload 입니다 (AxiosResponse 아님).
- 각 도메인 모듈은 엔드포인트만 얇게 감싸고, 로딩·에러 처리는 호출부 책임입니다.

### 인증 / 토큰

AccessToken · RefreshToken 은 **httpOnly 쿠키**로만 오갑니다.

- 서버가 `Set-Cookie` 로 내려주고 브라우저가 요청마다 자동 첨부합니다.
- 프론트는 토큰을 읽거나 저장하지 않습니다 — `withCredentials: true` 만 설정하면 끝.
  (localStorage 미사용 → XSS 토큰 탈취 위험 없음)
- 401 응답 시 인터셉터가 `/auth/refresh` 로 **한 번만** 재발급을 시도하고, 그 사이
  밀린 요청들을 큐에 모았다가 재시도합니다. 재발급까지 실패하면 `/login` 으로 이동합니다.

## 컴포넌트

`components/common/*.jsx` 는 **모양(markup + style)만** 담당합니다.
스타일은 `styles/common.styled.js`, 값은 `styles/theme.js` 토큰에서 옵니다.

| 컴포넌트        | 주요 props                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Button`        | `variant`(primary·secondary·ghost·warning·danger·dangerOutline), `size`(sm·md·lg), `fullWidth`, `loading`, `disabled` |
| `Input`         | `label`, `required`, `error`, `helperText`, `suffix` (+ 네이티브 input 속성)                                          |
| `Modal`         | `isOpen`, `onClose`, `title`, `footer`, `size`(sm·md·lg)                                                              |
| `Loading`       | `size`(sm·md·lg), `fullscreen`, `label`                                                                               |
| `Alert`         | `variant`(success·danger·warning·info), `onClose`                                                                     |
| `Badge`         | `variant`(neutral·success·info·danger·dangerOutline)                                                                  |
| `Pagination`    | `currentPage`, `totalPages`, `onPageChange`, `groupSize`(기본 5)                                                      |
| `Table`         | `columns`[{key,label,render?}], `data`, `rowKey`(기본 'id'), `emptyText`, `pagination`                                |
| `ToastProvider` | 앱을 감싸는 Provider. `ToastContext` 로 `showToast(message, variant, duration)` 제공                                  |

### 예시

```jsx
<Button variant="primary" size="md">저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger" loading>삭제 중…</Button>

<Input label="이메일" required error="형식이 올바르지 않습니다." />

<Modal
  isOpen={open}
  onClose={close}
  title="이름 변경"
  footer={<>
    <Button variant="secondary" onClick={close}>취소</Button>
    <Button onClick={save}>저장</Button>
  </>}
>
  <Input label="새 이름" />
</Modal>
```

## 스타일 계층

`styles/` 는 세 파일로 나뉘며, 의존은 **한 방향으로만** 흐릅니다.

```
theme.js  ←──  common.styled.js  ←──  components/common/*.jsx  ←──  페이지
   ↑
GlobalStyle.js
```

| 파일               | 역할                                                                                                                                                                                                                                                                                                                | 누가 쓰나                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `theme.js`         | **디자인 토큰** — 색·타이포·간격·radius·shadow·transition·z-index. 모든 디자인 값의 **단일 출처**. 순수 JS 객체라서 `import { theme }` 로 가져다 씀. 값 변경은 **여기서만**.                                                                                                                                        | `common.styled.js`, 그리고 페이지 전용 styled 컴포넌트                   |
| `common.styled.js` | **공용 "모양"** — `styled-components` 로 만든 재사용 styled 컴포넌트 모음(`ButtonBase`, `StyledInput`, `ModalBox` …). JSX·로직 없이 **CSS만** 담고, 값은 전부 `theme` 토큰 참조(하드코딩 금지). `variant`/`size` 처럼 조건부 스타일은 `$variant`, `$size` transient prop(`$` 접두사 — DOM 으로 안 내려감)으로 받음. | `components/common/*.jsx`                                                |
| `GlobalStyle.js`   | **전역 CSS** — `createGlobalStyle` 로 만든 컴포넌트. `<head>` 에 CSS 리셋 + `body` 기본값(폰트·색·배경) + 폰트 로드 + `.container`·`.visually-hidden` 유틸을 주입. 특정 컴포넌트에 속하지 않는 규칙만 둠.                                                                                                           | `main.jsx` / `preview.jsx` 최상단에서 `<GlobalStyle />` **한 번만** 렌더 |

### 쓰는 법

| 하고 싶은 것                | 방법                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| 버튼·모달·테이블 등 표준 UI | `components/common/*.jsx` 를 import (직접 `common.styled.js` 를 쓰지 않음)                 |
| 색·간격 값 참조             | `import { theme } from '.../styles/theme'` → `${theme.color.primary}`, `${theme.space.lg}` |
| 페이지 한정 레이아웃        | 그 파일에서 `styled` + `theme` 토큰으로 직접 작성                                          |
| 디자인 값 변경 (색·간격 등) | `theme.js` 만 수정 → 전 컴포넌트 반영                                                      |
| 앱 전역 규칙 추가           | `GlobalStyle.js` 수정                                                                      |
| 새 공용 컴포넌트            | `common.styled.js` 에 구간 추가 + 대응하는 `components/common/*.jsx` 래퍼 작성             |

> `theme` 은 `ThemeProvider` 컨텍스트가 아니라 **JS 모듈로 직접 import** 해서 씁니다. 그래서 `main.jsx` 에 `<ThemeProvider>` 가 없습니다.

## 색상

신호등식 의미 구분은 쓰지 않습니다. 색은 일반적인 UI 역할로만 씁니다.

- `primary` (그린) — 기본 / 강조 액션
- `danger` (코랄레드) — 위험 · 에러 · 삭제, 그리고 **알러지 표시**
- `caution` (호박색) — 주의가 필요한 액션
- `info` (파랑) — 안내 배너
- `gray*` — 텍스트 · 테두리 · 배경

알러지 여부는 "알러지 / 알러지 아님" 두 가지로만 다룹니다.
