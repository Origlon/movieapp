"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Header } from "@/app/features/header";
import { Footer } from "@/app/features/Footer";
import { MovieSection } from "@/app/components/Moviesection";

export default function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";
  const getData = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData;
  };
  const getCredits = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData;
  };
  const getSimilarMovies = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData.results;
  };
  const getVideos = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData.results;
  };
  useEffect(() => {
    getData(id)
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    Promise.all([getData(id), getCredits(id)])
      .then(([movieData, creditsData]) => {
        setMovie(movieData);
        setCredits(creditsData);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
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
  useEffect(() => {
    getVideos(id)
      .then((videos) => {
        const officialTrailer = videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true,
        );

        setTrailer(officialTrailer || null);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  const director = credits?.crew?.find((person) => person.job === "Director");

  const writers = credits?.crew?.filter(
    (person) =>
      person.department === "Writing" ||
      person.job === "Writer" ||
      person.job === "Screenplay",
  );

  const stars = credits?.cast?.slice(0, 3);
  return (
    <div>
      {loading && (
        <div className="relative flex min-h-screen flex-col items-center">
          <Header />

          <div className="mt-12 mb-8 w-full max-w-6xl px-4">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />

                <div className="mt-2 h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div>
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-7 w-20 animate-pulse rounded bg-gray-200" />

                <div className="mt-1 h-3 w-8 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div className="h-107.5 w-full animate-pulse rounded-xl bg-gray-200 md:w-72" />

              <div className="h-107.5 w-full animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>

          <Footer />
        </div>
      )}

      {!loading && errorMessage && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}

      {!loading && !errorMessage && movie && (
        <div className="relative flex min-h-screen flex-col items-center">
          <Header />

          <div className="mt-12 mb-8 w-full max-w-6xl px-4">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold leading-10 tracking-tight">
                  {movie.title}
                </h1>

                <p className="mt-1 text-lg font-extralight">
                  {movie.release_date} · {movie.runtime}m
                </p>
              </div>

              <div>
                <p className="text-xs text-[#09090B]">Rating</p>

                <div className="flex items-center gap-1">
                  <div className="flex flex-col">
                    <div className="flex items-end">
                      <span className="text-xl text-yellow-400 sm:text-2xl">
                        ★
                      </span>

                      <span className="text-lg font-normal">
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

            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div className="relative h-107.5 w-full shrink-0 overflow-hidden rounded-xl md:w-72">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="relative flex h-107.5 w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 text-white">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 hover:bg-gray-200"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>

                  <span
                    className="cursor-pointer select-none text-lg font-semibold"
                    onClick={() => setIsPlaying(true)}
                  >
                    Play trailer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isPlaying && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
              onClick={() => setIsPlaying(false)}
            >
              <div
                className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute right-4 top-4 z-50 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-white transition-all hover:bg-black"
                >
                  ✕ Close
                </button>

                {trailer && (
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}

          <div className="mb-8 flex w-full max-w-6xl flex-col gap-5 px-4">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-[#E4E4E7] bg-white px-3 py-1 text-xs font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div>
              <p className="text-base leading-relaxed text-gray-800">
                {movie.overview}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
                <p className="w-20 shrink-0 text-base font-bold">Director</p>

                <p className="text-base font-light">
                  {director?.name || "Unknown"}
                </p>
              </div>

              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
                <p className="w-20 shrink-0 text-base font-bold">Writers</p>

                <p className="text-base font-light">
                  {writers?.map((writer) => writer.name).join(" · ") ||
                    "Unknown"}
                </p>
              </div>

              <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
                <p className="w-20 shrink-0 text-base font-bold">Stars</p>

                <p className="text-base font-light">
                  {stars?.map((star) => star.name).join(" · ") || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16 w-full max-w-6xl px-4">
            <MovieSection
              title="More Like This"
              movies={similarMovies.slice(0, 5)}
            />
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}
