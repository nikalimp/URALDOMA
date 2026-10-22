"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// При переходе на другую страницу — сразу в самое начало. Next.js прокручивает к началу изменившегося сегмента,
// а шапка (sticky) и плавная прокрутка html оставляли страницу чуть ниже верха. Якоря (#calculator, #lead) не трогаем.
export function ScrollTop() {
  const path = usePathname();
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);
  return null;
}
