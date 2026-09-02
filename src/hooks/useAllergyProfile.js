import { useCallback, useEffect, useState } from "react";

import { getMyAllergies, updateMyAllergies } from "../apis/allergyApi";

/** 회원 1명당 등록 가능한 알러지 항목 최대 개수. 백엔드(MemberService.ALLERGY_LIST_MAX_SIZE)와 동일하게 맞춤 —
 *  여기서 막는 건 UX 보조일 뿐이고, 진짜 검증은 서버가 함(save 실패 시 서버 메시지를 그대로 보여줌). */
export const MAX_ALLERGY_COUNT = 100;

/**
 * 마이페이지 "알러지 필터 관리" 화면의 상태를 관리하는 훅.
 * - 마운트 시 서버에 저장된 알러지 목록을 불러와 체크 상태(Set)로 반영
 * - toggle(materialName)으로 체크/해제 (20개 초과 시 막고 실패 사유 반환)
 * - save()로 현재 체크된 목록 전체를 서버에 저장(전체 교체 — PATCH가 그렇게 동작함)
 *
 * @returns {{
 *   selected: Set<string>,
 *   toggle: (materialName: string) => { ok: boolean, msg: string },
 *   addCustom: (materialName: string) => { ok: boolean, msg: string },
 *   addMany: (materialNames: string[]) => { ok: boolean, msg: string, addedCount: number },
 *   remove: (materialName: string) => void,
 *   removeMany: (materialNames: string[]) => void,
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
    // 체크 해제는 개수가 줄어드는 방향이라 항상 허용. 체크(추가)만 상한을 본다.
    if (!selected.has(materialName) && selected.size >= MAX_ALLERGY_COUNT) {
      return { ok: false, msg: `알러지 항목은 최대 ${MAX_ALLERGY_COUNT}개까지 등록할 수 있습니다.` };
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(materialName)) {
        next.delete(materialName);
      } else {
        next.add(materialName);
      }
      return next;
    });
    return { ok: true, msg: "" };
  }, [selected]);

  /** "직접 추가" 입력창 전용 — 빈 값/30자 초과/중복/상한 순으로 검사 후 실패 사유를 반환 */
  const addCustom = useCallback((materialName) => {
    const trimmed = materialName.trim();
    if (!trimmed) {
      return { ok: false, msg: "재료명을 입력해주세요." };
    }
    if (trimmed.length > 30) {
      return { ok: false, msg: "알러지 항목은 각각 30자 이내로 입력해주세요." };
    }
    if (selected.has(trimmed)) {
      return { ok: false, msg: "이미 추가된 항목입니다." };
    }
    if (selected.size >= MAX_ALLERGY_COUNT) {
      return { ok: false, msg: `알러지 항목은 최대 ${MAX_ALLERGY_COUNT}개까지 등록할 수 있습니다.` };
    }
    setSelected((prev) => new Set(prev).add(trimmed));
    return { ok: true, msg: "" };
  }, [selected]);

  /** 칩의 X 버튼 전용 — 있든 없든 항상 제거 상태가 되도록 */
  const remove = useCallback((materialName) => {
    setSelected((prev) => {
      if (!prev.has(materialName)) return prev;
      const next = new Set(prev);
      next.delete(materialName);
      return next;
    });
  }, []);

  /**
   * "빠른 추가"(5대 알러지·견과류·갑각류 등 묶음/계통 버튼) 전용 — 이미 있는 항목은 조용히 건너뛰고,
   * 남은 자리(상한 - 현재 개수)만큼만 채운다. 하나도 못 채우면 실패로, 일부만 채우면 안내 메시지로 알려준다.
   */
  const addMany = useCallback((materialNames) => {
    const newOnes = materialNames.filter((name) => !selected.has(name));
    if (newOnes.length === 0) {
      return { ok: true, msg: "이미 전부 등록된 항목이에요.", addedCount: 0 };
    }
    const availableSlots = MAX_ALLERGY_COUNT - selected.size;
    if (availableSlots <= 0) {
      return { ok: false, msg: `알러지 항목은 최대 ${MAX_ALLERGY_COUNT}개까지 등록할 수 있습니다.`, addedCount: 0 };
    }
    const toAdd = newOnes.slice(0, availableSlots);
    setSelected((prev) => {
      const next = new Set(prev);
      toAdd.forEach((name) => next.add(name));
      return next;
    });
    const truncated = toAdd.length < newOnes.length;
    return {
      ok: true,
      msg: truncated ? `최대 ${MAX_ALLERGY_COUNT}개까지만 등록 가능해 일부만 추가됐어요.` : "",
      addedCount: toAdd.length,
    };
  }, [selected]);

  /** 여러 항목을 한 번에 제거 (하위 항목이 있는 메인 목록 체크박스를 해제할 때) */
  const removeMany = useCallback((materialNames) => {
    setSelected((prev) => {
      const next = new Set(prev);
      materialNames.forEach((name) => next.delete(name));
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

  return { selected, toggle, addCustom, addMany, remove, removeMany, save, isLoading, isSaving, error };
}
