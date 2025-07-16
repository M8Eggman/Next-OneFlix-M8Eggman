"use client";

import { useAppSelector } from "@/store/store";

export default function Test() {
  const animePricePromo = useAppSelector((state) => state.animesPricePromo);
  console.log(animePricePromo);
  return <div>Test</div>;
}
