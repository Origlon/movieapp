"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Header } from "@/app/features/Header";
import { Footer } from "@/app/features/Footer";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

export default function SearchPage() {
  const params = useParams();
  const router = useRouter();

  const query = String(params.query || "");

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedGenreIds, setSelectedGenreIds] = useState([]);

  const selectedGenres = genres.filter((genre) =>
    selectedGenreIds.includes(String(genre.id)),
  );

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      try {
        let url;

        if (selectedGenreIds.length > 0) {
          const genreIds = selectedGenreIds.join(",");

          url = `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${genreIds}&page=1`;
        } else {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query,
          )}&language=en-US&page=1`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${api_token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.status_message || "API Error");
        }

        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
      } catch (error) {
        console.error("MOVIE ERROR:", error);

        setMovies([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    if (query || selectedGenreIds.length > 0) {
      loadMovies();
    }
  }, [query, selectedGenreIds.join(",")]);

  const handleGenreClick = (genreId) => {
    const id = String(genreId);

    setSelectedGenreIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((genreId) => genreId !== id);
      }

      return [...prev, id];
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#09090B] dark:bg-gray-900 dark:text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4">
        <h2 className="text-3xl font-semibold text-[#09090B] dark:text-white">
          Search Filter
        </h2>

        <div className="mt-6 flex gap-10 border-t border-gray-200 pt-6 dark:border-gray-700">
          {/* MOVIES */}
          <section className="min-w-0 flex-1">
            <h3 className="mb-5 text-xl font-semibold text-[#09090B] dark:text-white">
              {loading
                ? "Loading..."
                : selectedGenres.length > 0
                  ? `${totalResults} titles in "${selectedGenres
                      .map((genre) => genre.name)
                      .join(", ")}"`
                  : `${totalResults} results for "${query}"`}
            </h3>

            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading movies...
              </p>
            ) : movies.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No movies found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {movies.slice(0, 8).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => router.push(`/detail/${movie.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* RATING */}
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span className="text-yellow-400">★</span>

                      <span className="font-semibold text-[#09090B] dark:text-white">
                        {movie.vote_average?.toFixed(1)}
                      </span>

                      <span className="text-gray-400 dark:text-gray-500">
                        /10
                      </span>
                    </div>

                    {/* TITLE */}
                    <span className="mt-1 block text-xl font-medium text-gray-800 dark:text-white">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* GENRES */}
          <aside className="w-45 shrink-0">
            <h3 className="mb-2 text-lg font-semibold text-[#09090B] dark:text-white">
              Genres
            </h3>

            <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              See lists of movies by genre
            </p>

            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => {
                const isSelected = selectedGenreIds.includes(String(genre.id));

                return (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-black bg-white text-gray-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                    }`}
                  >
                    <span>{genre.name}</span>

                    <ChevronRight size={10} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
