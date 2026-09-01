import { useCallback, useEffect, useState } from "react";

import { getMyAllergies, updateMyAllergies } from "../apis/allergyApi";

/**
 * 마이페이지 "알러지 필터 관리" 화면의 상태를 관리하는 훅.
 * - 마운트 시 서버에 저장된 알러지 목록을 불러와 체크 상태(Set)로 반영
 * - toggle(materialName)으로 체크/해제
 * - save()로 현재 체크된 목록 전체를 서버에 저장(전체 교체 — PATCH가 그렇게 동작함)
 *
 * @returns {{
 *   selected: Set<string>,
 *   toggle: (materialName: string) => void,
 *   save: () => Promise<{ ok: boolean, msg: string }>,
 *   isLoading: boolean,
 *   isSaving: boolean,
 *   error: string|null,
 * }}
 */
export function useAllergyProfile() {
  const [selected, setSelected] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    getMyAllergies()
      .then((res) => {
        if (ignore) return;
        setSelected(new Set(res.data?.allergyList ?? []));
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.msg ?? "알러지 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const toggle = useCallback((materialName) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(materialName)) {
        next.delete(materialName);
      } else {
        next.add(materialName);
      }
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await updateMyAllergies(Array.from(selected));
      setSelected(new Set(res.data?.allergyList ?? []));
      return { ok: true, msg: res.msg };
    } catch (err) {
      return { ok: false, msg: err.msg ?? "저장에 실패했습니다." };
    } finally {
      setIsSaving(false);
    }
  }, [selected]);

  return { selected, toggle, save, isLoading, isSaving, error };
}
