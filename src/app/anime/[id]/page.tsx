"use client";

import AjouterPanier from "@/components/buttons/AjouterPanier/AjouterPanier";
import "./AnimeDetails.sass";
import { fetchSingleAnime } from "@/lib/fetchAnime";
import { TypeAnime } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<TypeAnime | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetchSingleAnime(id as string, true).then((data) => setAnime(data));
  }, [id]);

  if (!anime) return <div className="animeDetailsLoading">Chargement...</div>;

  const {
    title,
    images,
    synopsis,
    score,
    scored_by,
    rating,
    status,
    year,
    genres,
    producers,
    studios,
    episodes,
    duration,
    aired,
    price,
    promotion,
    finalPrice,
    purchasable,
    trailer,
  } = anime;

  return (
    <div className="animeDetails">
      <div className="animeDetailsHeader">
        <img src={images.webp.large_image_url} alt={title} className="animeDetailsImage" />
        <div className="animeDetailsInfos">
          <h1>{title}</h1>
          <p>
            <strong>Année :</strong> {year || "?"}
          </p>
          <p>
            <strong>Statut :</strong> {status}
          </p>
          {score && scored_by && (
            <p>
              <strong>Note :</strong> {score}/10 ({scored_by.toString()} votes)
            </p>
          )}
          <p>
            <strong>Épisodes :</strong> {episodes || "?"}
          </p>
          <p>
            <strong>Durée :</strong> {duration}
          </p>
          <p>
            <strong>Diffusion :</strong> {aired?.prop?.from?.year} – {aired?.prop?.to?.year || "?"}
          </p>
          <p>
            <strong>Classification :</strong> {rating}
          </p>
          <p>
            <strong>Studios :</strong> {studios.map((s) => s.name).join(", ") || "Inconnu"}
          </p>
          <p>
            <strong>Producteurs :</strong> {producers.map((p) => p.name).join(", ") || "Inconnu"}
          </p>
          <p className="animeDetailsGenres">
            <strong>Genres :</strong>
            {genres.map((g) => (
              <span key={g.mal_id} onClick={() => router.push(`/animes?genreId=${g.mal_id}`)}>
                {g.name}
              </span>
            ))}
          </p>
        </div>
        <div className="animeDetailsPricing">
          <h3>Prix</h3>
          <div className="animeDetailsPricingContent">
            {purchasable ? (
              promotion && price ? (
                <>
                  <p>
                    <strong>{finalPrice?.toFixed(2)} €</strong>
                  </p>
                  <p className="oldPrice">{price.toFixed(2)} €</p>
                </>
              ) : price ? (
                <p>
                  <strong>{price.toFixed(2)} €</strong>
                </p>
              ) : (
                <p>Non disponible</p>
              )
            ) : (
              <p>Non disponible à la vente</p>
            )}
          </div>
          {purchasable && price && (
            <div className="animeDetailsPricingButton">
              <AjouterPanier anime={anime} />
            </div>
          )}
        </div>
      </div>
      <div className="animeDetailsSynopsis">
        <h2>Synopsis</h2>
        <p>{synopsis || "Aucune description disponible."}</p>
      </div>
      {trailer?.embed_url || trailer?.url ? (
        <div className="animeDetailsTrailer">
          <h2>Trailer</h2>
          {trailer.embed_url ? (
            <div className="animeDetailsTrailerVideo">
              <iframe
                src={trailer.embed_url}
                title={`Trailer de ${title}`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen></iframe>
            </div>
          ) : (
            <a href={trailer.url} className="animeDetailsTrailerButton">
              Voir le trailer
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
