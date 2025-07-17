"use client";

import { useAppSelector } from "@/store/store";
import NotFound from "../not-found";

export default function Panier() {
  // Récupère l'état de l'authentification
  const { isAuthenticated } = useAppSelector((state) => state.user);

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <div>Panier</div>;
}
