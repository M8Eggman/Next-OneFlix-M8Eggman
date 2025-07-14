"use client";

import "../auth.sass";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { login, loginWithOAuth, resetError } from "@/features/userSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFound from "@/app/not-found";
import { signIn, useSession } from "next-auth/react";
import GithubLogo from "@/assets/img/GitHub-Logo.png";

export default function Connexion() {
  const user = useAppSelector((state) => state.user);

  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Reset error au chargement de la page
  useEffect(() => {
    dispatch(resetError());
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // On envoie les infos dans Redux
      dispatch(
        loginWithOAuth({
          username: session.user.name || session.user.email,
          email: session.user.email || "",
          image: session.user.image,
        })
      );
    }
  }, [status, session]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ username: username.trim(), password: password.trim() }));
    router.push("/");
  };

  // Si l'utilisateur est connecté, on redirige vers la page d'accueil
  // if (user.isAuthenticated) {
  //   return <NotFound />;
  // }

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <section className="authSection">
      <div className="authContainer">
        <form className="authForm" onSubmit={handleSubmit}>
          <h1 className="authTitle">Connexion</h1>
          <div className="authInputGroup">
            <input
              type="text"
              id="username"
              className="authInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="current-username"
              placeholder="Nom d'utilisateur ou adresse e-mail"
            />
            <label htmlFor="username" className="authLabel">
              Nom d'utilisateur ou adresse e-mail
            </label>
          </div>
          <div className="authInputGroup">
            <input
              type="password"
              id="password"
              className="authInput"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Mot de passe"
            />
            <label htmlFor="password" className="authLabel">
              Mot de passe
            </label>
          </div>
          {user.error.login && <div className="authError">{user.error.login}</div>}
          <button type="submit" className="authButton">
            SE CONNECTER
          </button>
        </form>
        <div className="authOAuth">
          <h2 className="authOAuthTitle">Ou connectez-vous avec :</h2>
          <div className="authOAuthContainer">
            <button className="authGithub cursor-pointer" onClick={() => signIn("github", { callbackUrl: "/" })}>
              <img src={GithubLogo.src} alt="GitHub Logo" className="GithubLogo" />
            </button>
          </div>
        </div>
        <div className="authLoginContainer">
          <p className="authLogin">
            Vous n'avez pas de compte ? &nbsp;
            <Link href="/auth/inscription" className="authLink">
              CRÉER UN COMPTE
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
