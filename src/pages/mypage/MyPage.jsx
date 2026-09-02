import { Outlet, useLocation } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Avatar from "../../components/common/Avatar";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../hooks/useAuth";
import useMember from "../../hooks/useMember";
import {
  NavIcon,
  NavItem,
  NavList,
  PageWrap,
  ProfileEmail,
  ProfileName,
  ProfileSummary,
  SidebarWrap,
} from "./MyPage.styled";

const NAV_ITEMS = [
  { key: "info", label: "개인정보 관리", to: "/mypage", icon: "👤" },
  { key: "allergy", label: "알러지 필터 관리", to: "/mypage/allergy", icon: "🛡️" },
  { key: "bookmark", label: "즐겨찾는 레시피", to: "/mypage/bookmark", icon: "❤️" },
  { key: "recipes", label: "내 작성 레시피", to: "/mypage/recipes", icon: "📝" },
];

/**
 * 마이페이지 셸(shell) — path: /mypage/*
 * 사이드바(프로필 요약 + 탭 네비게이션)를 그리고, 실제 탭 내용은 <Outlet/>으로
 * 하위 라우트(ProfileEditPage 등)에 맡긴다. 회원 정보는 여기서 한 번만 불러와
 * { member, refetch }를 Outlet context로 내려줘서, 탭이 늘어나도 각 탭이 다시
 * fetch하지 않아도 된다.
 *
 * 지금은 "개인정보 관리" 탭만 실제 화면이 있어서, 나머지 3개는 화면 범위
 * (01_CLAUDE.md 2.[화면 범위])에 아직 없는 경로로 걸어둔 placeholder 링크다
 * (Footer 링크와 같은 이유).
 *
 * // TODO(T-5 연동): 회원 전용 라우트라 PrivateRoute가 생기면 그 안으로 옮길 것.
 */
function MyPage() {
  // 인증 부트스트랩(refresh → access 토큰 메모리 적재)이 끝난 뒤에 조회를 시작한다.
  // isReady 전에 쏘면 토큰 없이 나가 401 → 인터셉터가 또 refresh 하며 부트스트랩과 경합한다.
  const { isReady } = useAuth();
  const { data: member, isLoading, isError, error, refetch } = useMember(isReady);
  const { pathname } = useLocation();

  if (isLoading) {
    return <Loading fullscreen label="회원 정보를 불러오는 중입니다." />;
  }

  if (isError) {
    return (
      <PageWrap>
        <Alert variant="danger">{error?.msg || "회원 정보를 불러오지 못했습니다."}</Alert>
      </PageWrap>
    );
  }

  if (!member) return null;

  return (
    <PageWrap>
      <SidebarWrap>
        <ProfileSummary>
          <Avatar name={member.memberName} src={member.memberImgPath} size="lg" />
          <ProfileName>{member.memberName} 님</ProfileName>
          <ProfileEmail>{member.email}</ProfileEmail>
        </ProfileSummary>

        <NavList>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.key} to={item.to} $active={pathname === item.to}>
              <NavIcon aria-hidden="true">{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          ))}
        </NavList>
      </SidebarWrap>

      <Outlet context={{ member, refetch }} />
    </PageWrap>
  );
}

export default MyPage;
