"use client";

import "./UserDetails.sass";
import NotFound from "@/app/not-found";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNewsletter, updateUsername, updateEmail, updateImage } from "@/features/userSlice";

export default function UserDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, username, email, sendNewsletter, credit, image } = useAppSelector((state) => state.user);

  const [modalField, setModalField] = useState<"username" | "email" | "image" | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (modalField === "username") dispatch(updateUsername(inputValue));
      if (modalField === "email") dispatch(updateEmail(inputValue));
      if (modalField === "image") dispatch(updateImage(inputValue));
      setModalField(null);
      setInputValue("");
      if (modalField === "username") router.push(`/mon-compte/${inputValue}`);
    }
  };
  
  // Redirige vers 404 si non connecté
  if (!isAuthenticated) {
    return <NotFound />;
  }

  return (
    <div className="userPage">
      <div className="pageHeader">
        <button className="backButton" onClick={() => router.back()}>
          ← Retour
        </button>
        <h1>Mon Profil</h1>
      </div>
      <div className="userInfo">
        <div className="userDetailsImage">
          <img src={image || "/default-avatar.jpg"} alt="avatar utilisateur" />
          <button onClick={() => setModalField("image")}>Modifier l’image</button>
        </div>
        <div className="userDetails">
          <strong>Nom d'utilisateur :</strong> {username || "Non défini"}
          <br />
          <button
            onClick={() => {
              setModalField("username");
            }}>
            Modifier le nom
          </button>
        </div>
        <div className="userDetails">
          <strong>Email :</strong> {email || "Non défini"}
          <br />
          <button onClick={() => setModalField("email")}>Modifier l’email</button>
        </div>
        <div className="userDetails">
          <label>
            <input
              type="checkbox"
              checked={sendNewsletter}
              onChange={() => {
                dispatch(updateNewsletter(!sendNewsletter));
              }}
            />
            Recevoir la newsletter
          </label>
        </div>
        <div className="userDetails">
          <strong>Crédit :</strong> {credit.toFixed(2)} €
          <div className="creditForm">
            <button onClick={() => router.push("/paiement/ajouter-credit")}>Ajouter du crédit</button>
          </div>
        </div>
      </div>
      {modalField && (
        <div className="userModalOverlay" onClick={() => setModalField(null)}>
          <div className="userModalContent" onClick={(e) => e.stopPropagation()}>
            {modalField === "username" && <h2>Modifier le nom </h2>}
            {modalField === "email" && <h2>Modifier l’email</h2>}
            {modalField === "image" && <h2>Modifier l’image</h2>}
            <p>
              {modalField === "username" && "Le nom d'utilisateur ne doit pas contenir de caractères spéciaux."}
              {modalField === "email" && "L'email doit être valide."}
              {modalField === "image" && "L'URL de l'image doit être valide. (ex: https://example.com/image.jpg)"}
            </p>
            <input autoFocus type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Nouveau ${modalField}`} />
            <p className="hint">Appuie sur Entrée pour valider</p>
          </div>
        </div>
      )}
    </div>
  );
}
