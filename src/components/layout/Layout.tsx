"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";
import { useEffect } from "react";
import { fetchGenres } from "@/features/genreSlice";
import { loginWithOAuth } from "@/features/userSlice";
import { useSession } from "next-auth/react";

// Composant layout pour le projet OneFlix qui contient le nav et le footer
export default function Layout({ children }: { children: React.ReactNode }) {
  const { genres, loading, error } = useAppSelector((state) => state.genre);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  // Récupération des genres (une seule fois)
  useEffect(() => {
    if (genres?.length <= 0 && !loading) {
      dispatch(fetchGenres());
    }
  }, [genres, loading, dispatch]);

  // Si session OAuth active, login dans Redux
  useEffect(() => {
    if (!isAuthenticated && status === "authenticated" && session?.user) {
      dispatch(
        loginWithOAuth({
          username: session.user.name || session.user.email,
          email: session.user.email || "",
          image: session.user.image,
        })
      );
    }
  }, [status, session, isAuthenticated, dispatch]);

  return (
    <div>
      <Nav genres={genres} loading={loading} error={error} />
      {children}
      <Footer genres={genres} loading={loading} error={error} />
    </div>
  );
}
