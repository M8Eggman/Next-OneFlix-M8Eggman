"use client";

import "./Paiement.sass";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useState } from "react";
import { addCredit, clearCart } from "@/features/userSlice";
import NotFound from "@/app/not-found";
interface errors {
  cardNumber?: string;
  cardHolder?: string;
  cardCVV?: string;
  expiration?: string;
  creditToAdd?: string;
  credit?: string;
}
export default function PaiementPage() {
  const { type } = useParams(); // "ajouter-credit" ou "payer-anime"
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [creditToAdd, setCreditToAdd] = useState("10");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [expiration, setExpiration] = useState("");
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [isProcessingCredit, setIsProcessingCredit] = useState(false);
  const [errors, setErrors] = useState<errors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPanier = user.cart.reduce((sum, item) => sum + (item.isFreeWithPromotion ? 0 : item.finalPrice || 0), 0);

  // Valide un champ du formulaire
  function validateField(input: string, value: string) {
    // Copie les erreurs existantes
    const newErrors = { ...errors };
    // Vérifie le champ en fonction de l'input
    switch (input) {
      case "cardNumber":
        // Vérifie si le numéro de carte est valide
        if (value.trim().length === 0) {
          // Si le champ est vide, affiche une erreur
          newErrors.cardNumber = "Numéro de carte requis";
        } else {
          // Si le champ est rempli, supprime l'erreur
          delete newErrors.cardNumber;
        }
        break;
      // Pareil pour les autres champs
      case "cardHolder":
        if (value.trim().length === 0) {
          newErrors.cardHolder = "Nom requis";
        } else {
          delete newErrors.cardHolder;
        }
        break;
      case "cardCVV":
        if (value.trim().length === 0) {
          newErrors.cardCVV = "CVV requis";
        } else {
          delete newErrors.cardCVV;
        }
        break;
      case "expiration":
        if (value.trim().length === 0) {
          newErrors.expiration = "Date d'expiration requise";
        } else {
          delete newErrors.expiration;
        }
        break;
      case "creditToAdd":
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
          newErrors.creditToAdd = "Montant invalide";
        } else if (amount > 1000) {
          newErrors.creditToAdd = "Montant maximum: 1000€";
        } else {
          delete newErrors.creditToAdd;
        }
        break;
    }
    setErrors(newErrors);
  }

  // Vérifie si le formulaire de paiement est valide
  function cardIsValid() {
    return cardNumber.trim() !== "" && cardCVV.trim() !== "" && cardHolder.trim() !== "" && expiration.trim() !== "";
  }

  // Gère le paiement avec une carte fictive
  async function handleFakeCardPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!cardIsValid()) {
      // Vérifie tous les champs pour afficher les erreurs
      validateField("cardNumber", cardNumber);
      validateField("cardHolder", cardHolder);
      validateField("cardCVV", cardCVV);
      validateField("expiration", expiration);
      if (type === "ajouter-credit") {
        validateField("creditToAdd", creditToAdd);
      }
      return;
    }

    setIsProcessingCard(true);

    // Simule le paiement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (type === "ajouter-credit") {
        const amount = parseFloat(creditToAdd);
        if (!isNaN(amount) && amount > 0) {
          dispatch(addCredit(amount));
          setShowSuccess(true);
          // Redirige vers la page d'accueil
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      } else if (type === "payer-anime") {
        dispatch(clearCart());
        setShowSuccess(true);
        // Redirige vers la page d'accueil
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessingCard(false);
    }
  }

  // Gère le paiement avec le crédit
  async function handlePaiementAvecCredit() {
    if (user.credit >= totalPanier) {
      setIsProcessingCredit(true);
      // Utilise un timeout pour simuler le paiementd
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Retire le crédit et vide le panier
      dispatch(addCredit(-totalPanier));
      dispatch(clearCart());
      setShowSuccess(true);
      // Redirige vers la page d'accueil
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setErrors({ credit: "Crédit insuffisant!" });
    }
  }

  // Si l'utilisateur n'est pas connecté, affiche un message d'erreur
  if (!user.isAuthenticated) {
    return <NotFound />;
  }

  // Si le paiement est réussi, affiche un message de succès
  if (showSuccess) {
    return (
      <div className="paiementPage">
        <div className="successMessage">
          <div className="successIcon"></div>
          <h2>Paiement réussi!</h2>
          <p>Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="paiementPage">
      <div className="pageHeader">
        <button className="backButton" onClick={() => router.back()}>
          ← Retour
        </button>
        <h1>Paiement</h1>
      </div>
      <div className="paiementPageContent">
        <div className="paiementPageContentCard">
          <h2>Paiement par carte</h2>
          <form className="fakeCardForm" onSubmit={handleFakeCardPayment}>
            <div className="inputGroup">
              <label htmlFor="cardNumber">Numéro de carte</label>
              <input
                id="cardNumber"
                type="text"
                placeholder="1234567890123456"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  validateField("cardNumber", e.target.value);
                }}
                className={errors.cardNumber ? "error" : ""}
              />
              {errors.cardNumber && <span className="errorMessage">{errors.cardNumber}</span>}
            </div>
            <div className="inputGroup">
              <label htmlFor="cardHolder">Nom sur la carte</label>
              <input
                id="cardHolder"
                type="text"
                placeholder="Jean Dupont"
                value={cardHolder}
                onChange={(e) => {
                  setCardHolder(e.target.value);
                  validateField("cardHolder", e.target.value);
                }}
                className={errors.cardHolder ? "error" : ""}
              />
              {errors.cardHolder && <span className="errorMessage">{errors.cardHolder}</span>}
            </div>
            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="expiration">Expiration</label>
                <input
                  id="expiration"
                  type="text"
                  placeholder="12/30"
                  value={expiration}
                  onChange={(e) => {
                    setExpiration(e.target.value);
                    validateField("expiration", e.target.value);
                  }}
                  className={errors.expiration ? "error" : ""}
                />
                {errors.expiration && <span className="errorMessage">{errors.expiration}</span>}
              </div>
              <div className="inputGroup">
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cardCVV}
                  onChange={(e) => {
                    setCardCVV(e.target.value);
                    validateField("cardCVV", e.target.value);
                  }}
                  className={errors.cardCVV ? "error" : ""}
                />
                {errors.cardCVV && <span className="errorMessage">{errors.cardCVV}</span>}
              </div>
            </div>
            <button type="submit" disabled={isProcessingCard || (errors.creditToAdd ? true : false) || !cardIsValid()} className="primaryButton">
              {isProcessingCard ? (
                <>
                  <span className="spinner"></span>
                  Traitement...
                </>
              ) : type === "ajouter-credit" ? (
                "Ajouter le crédit"
              ) : (
                "Payer avec ma carte"
              )}
            </button>
          </form>
        </div>
        <div className="paiementPageContentRecap">
          <h2>{type === "ajouter-credit" ? "Ajouter du crédit" : "Récapitulatif"}</h2>
          {type === "ajouter-credit" && (
            <div className="creditSection">
              <div className="inputGroup">
                <label htmlFor="creditAmount">Montant à ajouter (€)</label>
                <input
                  id="creditAmount"
                  type="number"
                  value={creditToAdd}
                  onChange={(e) => {
                    setCreditToAdd(e.target.value);
                    validateField("creditToAdd", e.target.value);
                  }}
                  placeholder="10.00"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  className={errors.creditToAdd ? "error" : ""}
                />
                {errors.creditToAdd && <span className="errorMessage">{errors.creditToAdd}</span>}
              </div>
              <div className="quickAmounts">
                <p>Montants rapides:</p>
                <div className="quickButtons">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setCreditToAdd(amount.toString());
                        validateField("creditToAdd", amount.toString());
                      }}
                      className="quickButton">
                      {amount}€
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {type === "payer-anime" && (
            <div className="panierSummary">
              <h3>Panier:</h3>
              <div className="cartItems">
                {user.cart.map((item, i) => (
                  <div key={i} className="cartItem">
                    <span className="itemTitle">{item.title}</span>
                    <span className="itemPrice">{item.isFreeWithPromotion ? <span className="freeTag">Gratuit</span> : `${item.finalPrice.toFixed(2)} €`}</span>
                  </div>
                ))}
              </div>
              <div className="summaryLine">
                <span>Total:</span>
                <span className="totalAmount">{totalPanier.toFixed(2)} €</span>
              </div>
              <div className="summaryLine">
                <span>Crédit disponible:</span>
                <span className={user.credit >= totalPanier ? "creditSufficient" : "creditInsufficient"}>{user.credit.toFixed(2)} €</span>
              </div>
              {user.credit >= totalPanier && (
                <button onClick={handlePaiementAvecCredit} disabled={isProcessingCredit} className="creditButton">
                  {isProcessingCredit ? (
                    <>
                      <span className="spinner"></span>
                      Traitement...
                    </>
                  ) : (
                    "Payer avec mon crédit"
                  )}
                </button>
              )}
              {errors.credit && <div className="errorMessage creditError">{errors.credit}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
