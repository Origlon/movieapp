"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";

import { Header } from "@/app/features/Header";
import { Footer } from "@/app/features/Footer";
import { MovieSection } from "@/app/components/Moviesection";

export default function Detail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const [trailer, setTrailer] = useState(null);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  // ================= MOVIE DETAIL =================

  const getData = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Movie API Error");
    }

    return response.json();
  };

  // ================= CREDITS =================

  const getCredits = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Credits API Error");
    }

    return response.json();
  };

  // ================= SIMILAR MOVIES =================

  const getSimilarMovies = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Similar Movies API Error");
    }

    const data = await response.json();

    return data.results || [];
  };

  // ================= VIDEOS / TRAILER =================

  const getVideos = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Videos API Error");
    }

    const data = await response.json();

    return data.results || [];
  };

  // ================= GET DATA =================

  useEffect(() => {
    if (!id) return;

    Promise.all([getData(id), getCredits(id), getSimilarMovies(id)])
      .then(([movieData, creditsData, similarData]) => {
        setMovie(movieData);
        setCredits(creditsData);
        setSimilarMovies(similarData);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // ================= GET TRAILER =================

  useEffect(() => {
    if (!id) return;

    getVideos(id)
      .then((videos) => {
        let officialTrailer = videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true,
        );

        if (!officialTrailer) {
          officialTrailer = videos.find(
            (video) => video.site === "YouTube" && video.type === "Trailer",
          );
        }

        setTrailer(officialTrailer || null);
      })
      .catch((error) => {
        console.error(error);
        setTrailer(null);
      });
  }, [id]);

  // ================= DIRECTOR =================

  const director = credits?.crew?.find((person) => person.job === "Director");

  // ================= WRITERS =================

  const writers = credits?.crew?.filter(
    (person) =>
      person.department === "Writing" ||
      person.job === "Writer" ||
      person.job === "Screenplay",
  );

  // ================= STARS =================

  const stars = credits?.cast?.slice(0, 3);
  useEffect(() => {
    if (!movie) return;

    try {
      const saved = localStorage.getItem("moviez:recent");

      let recent = [];

      try {
        recent = saved ? JSON.parse(saved) : [];
      } catch {
        recent = [];
      }

      if (!Array.isArray(recent)) {
        recent = [];
      }

      const filtered = recent.filter((item) => item.id !== movie.id);

      const next = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          openedAt: Date.now(),
        },
        ...filtered,
      ];

      localStorage.setItem("moviez:recent", JSON.stringify(next.slice(0, 10)));
    } catch {}
  }, [movie]);

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let latestTime = 0;
    let latestProgress = 0;
    let latestMovieId = null;

    const handleMessage = (event) => {
      if (typeof event.data !== "string") return;

      try {
        const data = JSON.parse(event.data);

        if (data.data.currentTime !== undefined) {
          latestTime = Number(data.data.currentTime);
        }
        if (data.data.progress !== undefined) {
          latestProgress = Number(data.data.progress);
        }
        if (data.data?.id !== undefined) {
          latestMovieId = String(data.data.id);
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);

    const interval = setInterval(() => {
      setCurrentTime(latestTime);
      setProgress(latestProgress);

      if (!latestMovieId) return;

      try {
        const saved = localStorage.getItem("moviez:recent");

        if (!saved) return;

        const recent = JSON.parse(saved);

        if (!Array.isArray(recent)) return;

        const updated = recent.map((movie) => {
          if (String(movie.id) !== latestMovieId) {
            return movie;
          }

          return {
            ...movie,
            progress: latestProgress,
          };
        });

        localStorage.setItem("moviez:recent", JSON.stringify(updated));
      } catch {}
    }, 10000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, []);
  console.log(currentTime);
  console.log(progress);
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
          <Header />

          <div className="mt-12 mb-8 w-full max-w-6xl px-4">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

                <div className="mt-2 h-6 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
              </div>

              <div>
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                <div className="mt-2 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                <div className="mt-1 h-3 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div className="h-107.5 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 md:w-72" />

              <div className="h-107.5 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          <Footer />
        </div>
      )}

      {!loading && errorMessage && (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}

      {!loading && !errorMessage && movie && (
        <div className="relative flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
          <Header />

          <div className="mt-12 mb-8 w-full max-w-6xl px-4">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold leading-10 tracking-tight text-[var(--foreground)]">
                  {movie.title}
                </h1>

                <p className="mt-1 text-lg font-extralight text-[var(--foreground)]">
                  {movie.release_date} · {movie.runtime}m
                </p>
              </div>

              {/* RATING */}

              <div>
                <span className="text-xs text-[var(--foreground)]">Rating</span>

                <div className="flex items-center gap-1">
                  <div className="flex flex-col">
                    <div className="flex items-end">
                      <span className="text-xl text-yellow-400 sm:text-2xl">
                        ★
                      </span>

                      <span className="text-lg font-normal text-[var(--foreground)]">
                        {movie.vote_average?.toFixed(1)}
                      </span>

                      <span className="text-lg text-[#71717A]">/10</span>
                    </div>

                    <span className="text-xs text-[#71717A]">
                      {movie.vote_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= POSTER + BACKDROP ================= */}

            <div className="flex flex-col justify-between gap-8 md:flex-row">
              {/* POSTER */}

              <div className="relative h-107.5 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 md:w-72">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* BACKDROP */}

              <div className="relative flex h-107.5 w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />

                {/* PLAY TRAILER */}

                <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 text-white">
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 hover:bg-gray-200"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>

                  <span
                    className="cursor-pointer select-none text-lg font-semibold"
                    onClick={() => setIsTrailerOpen(true)}
                  >
                    Play trailer
                  </span>
                </div>

                {/* WATCH NOW */}

                <button
                  onClick={() => setIsMovieOpen(true)}
                  className="absolute bottom-6 right-6 z-10 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition hover:scale-105 hover:bg-gray-100"
                >
                  Watch now
                </button>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TRAILER MODAL */}
          {/* ================================================= */}

          {isTrailerOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
              onClick={() => setIsTrailerOpen(false)}
            >
              <div
                className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="absolute right-4 top-4 z-50 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-white transition-all hover:bg-black"
                >
                  ✕ Close
                </button>

                {trailer ? (
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white">
                    <p>Trailer not available.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* MOVIE MODAL */}
          {/* ================================================= */}

          {isMovieOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
              onClick={() => setIsMovieOpen(false)}
            >
              <div
                className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsMovieOpen(false)}
                  className="absolute right-4 top-4 z-50 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-white transition-all hover:bg-black"
                >
                  ✕ Close
                </button>

                <iframe
                  className="h-full w-full"
                  src={`https://www.vidking.net/embed/movie/${id}`}
                  title={movie.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* GENRES + OVERVIEW + INFO */}
          {/* ================================================= */}

          <div className="mb-8 flex w-full max-w-6xl flex-col gap-5 px-4">
            {/* GENRES */}

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-[#E4E4E7] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--foreground)] dark:border-gray-600"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* OVERVIEW */}

            <div>
              <p className="text-base leading-relaxed text-[var(--foreground)]">
                {movie.overview}
              </p>
            </div>

            {/* DIRECTOR / WRITERS / STARS */}

            <div className="flex flex-col gap-4">
              {/* DIRECTOR */}

              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3 dark:border-gray-700">
                <p className="w-20 shrink-0 text-base font-bold text-[var(--foreground)]">
                  Director
                </p>

                <p className="text-base font-light text-[var(--foreground)]">
                  {director?.name || "Unknown"}
                </p>
              </div>

              {/* WRITERS */}

              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3 dark:border-gray-700">
                <p className="w-20 shrink-0 text-base font-bold text-[var(--foreground)]">
                  Writers
                </p>

                <p className="text-base font-light text-[var(--foreground)]">
                  {writers?.map((writer) => writer.name).join(" · ") ||
                    "Unknown"}
                </p>
              </div>

              {/* STARS */}

              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3 dark:border-gray-700">
                <p className="w-20 shrink-0 text-base font-bold text-[var(--foreground)]">
                  Stars
                </p>

                <p className="text-base font-light text-[var(--foreground)]">
                  {stars?.map((star) => star.name).join(" · ") || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* MORE LIKE THIS */}
          {/* ================================================= */}

          <div className="mb-16 w-full max-w-6xl px-4">
            <MovieSection
              title="More Like This"
              movies={similarMovies.slice(0, 5)}
              path={`/similiar/${id}`}
            />
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}
