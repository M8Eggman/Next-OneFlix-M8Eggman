"use client";

import { useRouter } from "next/navigation";

export default function BouttonVoirPlus({ link }: { link: string }) {
  const router = useRouter();

  return (
    <div className="voirPlus" onClick={() => router.push(link)}>
      <span>Voir </span>
      <span>plus</span>
    </div>
  );
}
