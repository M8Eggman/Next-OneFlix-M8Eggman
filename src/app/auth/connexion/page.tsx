"use client";

import "../auth.sass";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { login, resetError } from "@/features/userSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFound from "@/app/not-found";

export default function Connexion() {
  const user = useAppSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Reset error au chargement de la page
  useEffect(() => {
    dispatch(resetError());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ username: username.trim(), password: password.trim() }));
    router.push("/");
  };

  // Si l'utilisateur est connecté, on redirige vers la page d'accueil 
  if (user.isAuthenticated) {
    return <NotFound />;
  }

  return (
    <div className="inscriptionContainer">
      <form className="inscriptionForm" onSubmit={handleSubmit}>
        <h1 className="inscriptionTitle">Connexion</h1>
        <div className="inscriptionInputGroup">
          <input
            type="text"
            id="username"
            className="inscriptionInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="current-username"
            placeholder="Nom d'utilisateur ou adresse e-mail"
          />
          <label htmlFor="username" className="inscriptionLabel">
            Nom d'utilisateur ou adresse e-mail
          </label>
        </div>
        <div className="inscriptionInputGroup">
          <input
            type="password"
            id="password"
            className="inscriptionInput"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Mot de passe"
          />
          <label htmlFor="password" className="inscriptionLabel">
            Mot de passe
          </label>
        </div>
        {user.error.login && <div className="inscriptionError">{user.error.login}</div>}
        <button type="submit" className="inscriptionButton">
          SE CONNECTER
        </button>
      </form>
      <div className="inscriptionLoginContainer">
        <p className="inscriptionLogin">
          Vous n'avez pas de compte ? &nbsp;
          <Link href="/auth/inscription" className="inscriptionLink">
            CRÉER UN COMPTE
          </Link>
        </p>
      </div>
    </div>
  );
}
