"use client";

import "../auth.sass";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { register, resetError } from "@/features/userSlice";
import NotFound from "@/app/not-found";
import { useRouter } from "next/navigation";
import GithubLogo from "@/assets/img/GitHub-Logo.png";
import { signIn } from "next-auth/react";

export default function Inscription() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  // Reset error au chargement de la page
  useEffect(() => {
    dispatch(resetError());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register({ username, email, password, sendNewsletter: newsletter }));
    router.push("/");
  };

  // Si l'utilisateur est connecté, on redirige vers la page d'accueil et on affiche un message d'erreur
  if (user.isAuthenticated) {
    return <NotFound />;
  }

  return (
    <section className="authSection">
      <div className="authContainer">
        <form className="authForm" onSubmit={handleSubmit}>
          <h1 className="authTitle">Créer un compte</h1>
          <div className="authInputGroup">
            <input
              type="text"
              id="username"
              className="authInput"
              required
              autoComplete="username"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username" className="authLabel">
              Nom d'utilisateur
            </label>
          </div>
          <div className="authInputGroup">
            <input
              type="email"
              id="email"
              className="authInput"
              required
              autoComplete="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className="authLabel">
              Adresse e-mail
            </label>
          </div>
          <div className="authInputGroup">
            <input
              type="password"
              id="password"
              className="authInput"
              minLength={6}
              autoComplete="password"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="authLabel">
              Mot de passe
            </label>
          </div>
          <p className="authInfo">Utilisez au moins 6 caractères. N'utilisez pas d'espaces vides.</p>
          <div className="authCheckboxContainer">
            <input type="checkbox" id="newsletter" className="authCheckbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
            <label htmlFor="newsletter" className="authCheckboxLabel">
              Envoyez-moi infos, offres et actus OneFlix.
            </label>
          </div>
          {user.error?.register && <div className="authError">{user.error?.register}</div>}
          <button type="submit" className="authButton">
            CRÉER UN COMPTE
          </button>
        </form>
        <div className="authOAuth">
          <h2 className="authOAuthTitle">Ou créez un compte avec :</h2>
          <button className="authGithub cursor-pointer" onClick={() => signIn("github", { callbackUrl: "/" })}>
            <img src={GithubLogo.src} alt="GitHub Logo" className="GithubLogo" />
          </button>
        </div>
        <div className="authLoginContainer">
          <p className="authLogin">
            Vous avez déjà un compte ? &nbsp;
            <Link href="/auth/connexion" className="authLink">
              SE CONNECTER
            </Link>
          </p>
          <p className="authTerms">
            En créant un compte, vous acceptez nos &nbsp;
            <a href="" className="authLink">
              {" "}
              {/* faux lien */}
              Conditions d'utilisation
            </a>
            &nbsp;et notre &nbsp;
            <a href="" className="authLink">
              {" "}
              {/* faux lien */}
              Politique de confidentialité
            </a>
            , et vous confirmez avoir au moins 16 ans.
          </p>
        </div>
      </div>
    </section>
  );
}
