"use client";

import "./not-found.sass";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="globalNotFoundPage">
      <h1>Erreur 404</h1>
      <p>Cette page n'existe pas</p>
      <button onClick={() => router.push("/")}>Revenir à l'accueil</button>
    </div>
  );
}
