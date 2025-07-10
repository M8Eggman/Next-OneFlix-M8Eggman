"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";
import { useEffect } from "react";
import { fetchGenres } from "@/features/genreSlice";

// Composant layout pour le projet OneFlix qui contient le nav et le footer qui permet de faire qu'un seul fetch des genres
export default function Layout({ children }: { children: React.ReactNode }) {
  // Récupération des genres d'anime depuis redux
  const { genres, loading, error } = useAppSelector((state) => state.genre);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (genres?.length <= 0 && !loading) {
      dispatch(fetchGenres());
    }
  }, [genres, loading, dispatch]);
  return (
    <div>
      <Nav genres={genres} loading={loading} error={error} />
      {children}
      <Footer genres={genres} loading={loading} error={error} />
    </div>
  );
}
