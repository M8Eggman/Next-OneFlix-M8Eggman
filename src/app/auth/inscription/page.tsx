"use client";

import "../auth.sass";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { register, resetError } from "@/features/userSlice";
import NotFound from "@/app/not-found";

export default function Inscription() {
  const user = useAppSelector((state) => state.user);

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
  };

  // Si l'utilisateur est connecté, on redirige vers la page d'accueil et on affiche un message d'erreur
  if (user.isAuthenticated) {
    return <NotFound />;
  }

  return (
    <div className="inscriptionContainer">
      <form className="inscriptionForm" onSubmit={handleSubmit}>
        <h1 className="inscriptionTitle">Créer un compte</h1>
        <div className="inscriptionInputGroup">
          <input
            type="text"
            id="username"
            className="inscriptionInput"
            required
            autoComplete="username"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username" className="inscriptionLabel">
            Nom d'utilisateur
          </label>
        </div>
        <div className="inscriptionInputGroup">
          <input
            type="email"
            id="email"
            className="inscriptionInput"
            required
            autoComplete="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email" className="inscriptionLabel">
            Adresse e-mail
          </label>
        </div>
        <div className="inscriptionInputGroup">
          <input
            type="password"
            id="password"
            className="inscriptionInput"
            minLength={6}
            autoComplete="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className="inscriptionLabel">
            Mot de passe
          </label>
        </div>
        <p className="inscriptionInfo">Utilisez au moins 6 caractères. N'utilisez pas d'espaces vides.</p>
        <div className="inscriptionCheckboxContainer">
          <input type="checkbox" id="newsletter" className="inscriptionCheckbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
          <label htmlFor="newsletter" className="inscriptionCheckboxLabel">
            Envoyez-moi infos, offres et actus OneFlix.
          </label>
        </div>
        {user.error?.register && <div className="inscriptionError">{user.error?.register}</div>}
        <button type="submit" className="inscriptionButton">
          CRÉER UN COMPTE
        </button>
      </form>
      <div className="inscriptionLoginContainer">
        <p className="inscriptionLogin">
          Vous avez déjà un compte ? &nbsp;
          <Link href="/auth/connexion" className="inscriptionLink">
            SE CONNECTER
          </Link>
        </p>
        <p className="inscriptionTerms">
          En créant un compte, vous acceptez nos &nbsp;
          <a href="" className="inscriptionLink">
            {" "}
            {/* faux lien */}
            Conditions d'utilisation
          </a>
          &nbsp;et notre &nbsp;
          <a href="" className="inscriptionLink">
            {" "}
            {/* faux lien */}
            Politique de confidentialité
          </a>
          , et vous confirmez avoir au moins 16 ans.
        </p>
      </div>
    </div>
  );
}
