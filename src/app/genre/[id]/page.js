"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Header } from "../../features/Header";
import { Footer } from "../../features/Footer";
import { MovieSkeleton } from "@/app/components/MovieSkeleton";

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

export default function GenrePage() {
  const { id } = useParams();
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // URL-аас genre ID-уудыг авна
  const selectedGenreIds = id ? decodeURIComponent(String(id)).split(",") : [];

  // ID-аар genre-ийн нэрүүдийг олно
  const selectedGenres = genres.filter((genre) =>
    selectedGenreIds.includes(String(genre.id)),
  );

  const getMoviesByGenre = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${selectedGenreIds.join(
        "%2C",
      )}`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Movie API error");
    }

    return response.json();
  };

  useEffect(() => {
    getMoviesByGenre()
      .then((response) => {
        setMovies(response.results || []);
        setTotalResults(response.total_results || 0);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
        setMovies([]);
        setTotalResults(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleGenreClick = (genreId) => {
    const idString = String(genreId);

    let newSelectedGenreIds;

    if (selectedGenreIds.includes(idString)) {
      newSelectedGenreIds = selectedGenreIds.filter((id) => id !== idString);
    } else {
      newSelectedGenreIds = [...selectedGenreIds, idString];
    }

    // Бүх genre-ийг арын URL-д хадгална
    if (newSelectedGenreIds.length === 0) {
      router.push("/genre/28");
      return;
    }

    router.push(`/genre/${newSelectedGenreIds.join("%2C")}`);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-4">
        <h2 className="text-3xl font-semibold">Search Filter</h2>

        <div className="mt-6 flex gap-10 border-t border-gray-200 pt-6">
          {/* GENRES */}
          <aside className="w-45 shrink-0">
            <h3 className="mb-2 text-lg font-semibold">Genres</h3>

            <p className="mb-4 text-xs text-gray-500">
              See lists of movies by genre
            </p>

            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold transition text-[var(--foreground)] ${
                    selectedGenreIds.includes(String(genre.id))
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span>{genre.name}</span>

                  <ChevronRight size={10} strokeWidth={2} />
                </button>
              ))}
            </div>
          </aside>

          {/* MOVIES */}
          <section className="min-w-0 flex-1">
            <h3 className="mb-5 text-xl font-semibold">
              {loading
                ? "Loading..."
                : `${totalResults} titles in "${selectedGenres
                    .map((genre) => genre.name)
                    .join(", ")}"`}
            </h3>

            {loading ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))}
              </div>
            ) : errorMessage ? (
              <p className="text-sm text-red-500">{errorMessage}</p>
            ) : movies.length === 0 ? (
              <p className="text-sm text-gray-500">No movies found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {movies.slice(0, 8).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => router.push(`/detail/${movie.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-100">
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

                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span className="text-yellow-400">★</span>

                      <span className="font-semibold">
                        {movie.vote_average?.toFixed(1)}
                      </span>

                      <span className="text-gray-400">/10</span>
                    </div>

                    <span className="mt-1 block text-sm font-medium text-[var(--foreground)]">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
