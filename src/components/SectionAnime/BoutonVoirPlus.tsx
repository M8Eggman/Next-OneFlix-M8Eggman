"use client";

import { useRouter } from "next/navigation";

export default function BouttonVoirPlus({ link }: { link: string }) {
  const router = useRouter();

  return (
    <div className="voirPlus">
      <span>Voir </span>
      <span onClick={() => router.push(link)}>plus</span>
    </div>
  );
}
