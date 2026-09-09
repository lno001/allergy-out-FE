import { useCallback, useEffect, useState } from "react";

import { createDevice, getDevice } from "../apis/raspApi";

/**
 * 마이페이지 "소모 칼로리 측정" 탭의 만보기(디바이스) 등록/조회 상태.
 * - 마운트 시 조회. 미등록(404)은 에러가 아니라 정상 상태(deviceNo=null)로 다룬다.
 * - register()는 멱등 등록 — 이미 있어도 안전하게 다시 부를 수 있다.
 *
 * @returns {{
 *   deviceNo: number|null,
 *   isLoading: boolean,
 *   isRegistering: boolean,
 *   error: string|null,
 *   register: () => Promise<{ ok: boolean, msg: string }>,
 * }}
 */
export function useDevice() {
  const [deviceNo, setDeviceNo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    getDevice()
      .then((res) => {
        if (ignore) return;
        setDeviceNo(res.data?.deviceNo ?? null);
      })
      .catch((err) => {
        if (ignore) return;
        if (err.code === 404) {
          setDeviceNo(null); // 미등록 — 정상 상태
        } else {
          setError(err.msg ?? "디바이스 정보를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const register = useCallback(async () => {
    setIsRegistering(true);
    try {
      const res = await createDevice();
      setDeviceNo(res.data?.deviceNo ?? null);
      return { ok: true, msg: res.msg };
    } catch (err) {
      return { ok: false, msg: err.msg ?? "디바이스 등록에 실패했습니다." };
    } finally {
      setIsRegistering(false);
    }
  }, []);

  return { deviceNo, isLoading, isRegistering, error, register };
}
