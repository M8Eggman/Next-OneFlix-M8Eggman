"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchAllAnime, setPageAll } from "@/features/animeSlice";
import { TypeAnime } from "@/types";

export default function TestAllAnimePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const all = useAppSelector((state) => state.anime.all);
  const pagination = useAppSelector((state) => state.anime.allPagination);
  const loading = useAppSelector((state) => state.anime.loadingAll);
  const error = useAppSelector((state) => state.anime.errorAll);

  useEffect(() => {
    dispatch(setPageAll(currentPage));
    dispatch(fetchAllAnime(currentPage));
  }, [dispatch, currentPage]);

  const updatePage = (page: number) => {
    router.push(`?page=${page}`);
  };

  if (pagination && currentPage > pagination.last_visible_page) return <p>Cette page n'existe pas</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tous les Animes — Page {currentPage}{pagination && `/${pagination?.last_visible_page}`}
      </h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {all.map((anime: TypeAnime) => (
          <div key={anime.mal_id} className="bg-white p-2 rounded-xl shadow hover:shadow-md transition">
            <img src={anime.images.webp.image_url} alt={anime.title} className="rounded mb-2" />
            <h2 className="text-sm font-semibold">{anime.title}</h2>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => updatePage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Précédent
        </button>
        <button onClick={() => updatePage(currentPage + 1)} disabled={!pagination?.has_next_page} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Suivant
        </button>
      </div>
    </div>
  );
}
