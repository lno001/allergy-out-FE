import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  refresh,
} from "../apis/authApi";
import { clearAccessToken } from "../utils/accessTokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const toUser = (data) => {
    if (!data) {
      return null;
    }
    return {
      memberNo: data.memberNo,
      memberId: data.memberId,
      memberName: data.memberName,
      role: data.role,
      memberImg: data.memberImg,
      memberImgPath: data.memberImgPath,
    };
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const accessToken = await refresh();
        if (!accessToken) {
          setUser(null);
          return;
        }
        const meRes = await getMe();
        setUser(toUser(meRes.data));
      } catch {
        clearAccessToken();
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };
    bootstrap();
  }, []);

  const login = async (payload) => {
    const res = await loginApi(payload);
    setUser(toUser(res.data));
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  };

  // 프로필 수정 후 헤더(useAuth().user)를 다시 조회 없이 동기화하는 용도.
  // 예: 이름 변경 성공 → patchUser({ memberName }), 사진 변경 → patchUser({ memberImgPath }).
  const patchUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const value = useMemo(
    () => ({ user, isReady, login, logout, patchUser }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
