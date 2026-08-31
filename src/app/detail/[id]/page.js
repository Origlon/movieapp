"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Download, Subtitles, Loader2, Captions } from "lucide-react";

import { Header } from "@/app/features/Header";
import { Footer } from "@/app/features/Footer";
import { MovieSection } from "@/app/components/Moviesection";

export default function Detail() {
  const { id } = useParams();

  const iframeRef = useRef(null);

  // =========================================================
  // STATE
  // =========================================================

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const [trailer, setTrailer] = useState(null);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);

  // =========================================================
  // MONGOLIAN SUBTITLE
  // =========================================================

  const [subtitleUrl, setSubtitleUrl] = useState(null);
  const [subtitleLoading, setSubtitleLoading] = useState(false);
  const [subtitleError, setSubtitleError] = useState("");
  const [subtitleDownloaded, setSubtitleDownloaded] = useState(false);
  const [savedSubtitle, setSavedSubtitle] = useState(null);

  // =========================================================
  // PROGRESS
  // =========================================================

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // =========================================================
  // API TOKEN
  // =========================================================

  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  // =========================================================
  // GET MOVIE
  // =========================================================

  const getData = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
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

  // =========================================================
  // GET CREDITS
  // =========================================================

  const getCredits = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
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

  // =========================================================
  // GET SIMILAR MOVIES
  // =========================================================

  const getSimilarMovies = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
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

  // =========================================================
  // GET VIDEOS
  // =========================================================

  const getVideos = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
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

  // =========================================================
  // LOAD MOVIE DATA
  // =========================================================

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setErrorMessage("");

    Promise.all([getData(id), getCredits(id), getSimilarMovies(id)])
      .then(([movieData, creditsData, similarData]) => {
        if (cancelled) return;

        setMovie(movieData);
        setCredits(creditsData);
        setSimilarMovies(similarData);
      })
      .catch((error) => {
        if (cancelled) return;

        console.error("MOVIE DATA ERROR:", error);

        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================================================
  // LOAD TRAILER
  // =========================================================

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    getVideos(id)
      .then((videos) => {
        if (cancelled) return;

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
        if (cancelled) return;

        console.error("TRAILER ERROR:", error);

        setTrailer(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================================================
  // CHECK MONGOLIAN SUBTITLE
  // =========================================================

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const url = `/api/subtitle?movieId=${encodeURIComponent(id)}`;

    setSubtitleLoading(true);
    setSubtitleError("");
    setSubtitleUrl(null);
    setSubtitleDownloaded(false);

    console.log("=================================");
    console.log("🇲🇳 CHECKING MONGOLIAN SUBTITLE");
    console.log("🎬 MOVIE ID:", id);
    console.log("🇲🇳 URL:", url);
    console.log("=================================");

    const checkSubtitle = async () => {
      try {
        const response = await fetch(url, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Subtitle API returned ${response.status}`);
        }

        const vtt = await response.text();

        if (cancelled) return;

        console.log("🇲🇳 SUBTITLE RESPONSE LENGTH:", vtt.length);

        if (!vtt.trim().startsWith("WEBVTT")) {
          throw new Error("Invalid WebVTT");
        }

        setSubtitleUrl(url);

        console.log("✅ MONGOLIAN SUBTITLE AVAILABLE:", url);
      } catch (error) {
        if (cancelled) return;

        console.error("❌ MONGOLIAN SUBTITLE ERROR:", error);

        setSubtitleUrl(null);
        setSubtitleError("Монгол subtitle олдсонгүй.");
      } finally {
        if (!cancelled) {
          setSubtitleLoading(false);
        }
      }
    };

    checkSubtitle();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================================================
  // DOWNLOAD MONGOLIAN SUBTITLE
  // =========================================================
  useEffect(() => {
    if (!id) return;

    try {
      const key = `moviez:subtitle:${id}`;

      const saved = localStorage.getItem(key);

      if (!saved) {
        console.log("🇲🇳 NO SAVED SUBTITLE");
        return;
      }

      const subtitleData = JSON.parse(saved);

      if (!subtitleData?.vtt) {
        console.log("❌ SAVED SUBTITLE INVALID");
        return;
      }

      setSavedSubtitle(subtitleData.vtt);
      setSubtitleDownloaded(true);

      console.log("✅ SAVED MONGOLIAN SUBTITLE LOADED");
      console.log("🎬 MOVIE ID:", id);
      console.log("📦 VTT LENGTH:", subtitleData.vtt.length);
    } catch (error) {
      console.error("❌ LOAD SAVED SUBTITLE ERROR:", error);
    }
  }, [id]);
  const downloadSubtitle = useCallback(async () => {
    if (!subtitleUrl) {
      console.log("❌ SUBTITLE URL NOT READY");
      return;
    }

    if (!id) {
      console.log("❌ MOVIE ID NOT READY");
      return;
    }

    try {
      setSubtitleError("");

      console.log("🇲🇳 DOWNLOADING MONGOLIAN SUBTITLE...");

      const response = await fetch(subtitleUrl, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Subtitle download failed: ${response.status}`);
      }

      const vtt = await response.text();

      if (!vtt.trim().startsWith("WEBVTT")) {
        throw new Error("Invalid VTT file");
      }

      // =====================================================
      // SAVE VTT TO LOCAL STORAGE
      // =====================================================

      const subtitleData = {
        movieId: String(id),

        movieTitle: movie?.title || `Movie ${id}`,

        vtt: vtt,

        savedAt: Date.now(),
      };

      localStorage.setItem(
        `moviez:subtitle:${id}`,
        JSON.stringify(subtitleData),
      );

      console.log("💾 MONGOLIAN SUBTITLE SAVED TO LOCAL STORAGE");

      console.log("📦 STORAGE KEY:", `moviez:subtitle:${id}`);

      console.log("📦 VTT LENGTH:", vtt.length);

      // =====================================================
      // UPDATE STATE
      // =====================================================

      setSavedSubtitle(vtt);

      setSubtitleDownloaded(true);

      // =====================================================
      // DOWNLOAD FILE TO COMPUTER
      // =====================================================

      const blob = new Blob([vtt], {
        type: "text/vtt;charset=utf-8",
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = `${movie?.title || `movie-${id}`}-mongolian.vtt`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      console.log("✅ MONGOLIAN SUBTITLE DOWNLOADED");
    } catch (error) {
      console.error("❌ SUBTITLE DOWNLOAD ERROR:", error);

      setSubtitleError("Subtitle татахад алдаа гарлаа.");
    }
  }, [subtitleUrl, movie, id]);
  // =========================================================
  // RECENT MOVIE
  // =========================================================

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

      const existingMovie = recent.find(
        (item) => String(item.id) === String(movie.id),
      );

      const filtered = recent.filter(
        (item) => String(item.id) !== String(movie.id),
      );

      const nextMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,

        openedAt: existingMovie?.openedAt || Date.now(),

        progress:
          typeof existingMovie?.progress === "number"
            ? existingMovie.progress
            : 0,

        currentTime:
          typeof existingMovie?.currentTime === "number"
            ? existingMovie.currentTime
            : 0,
      };

      const next = [nextMovie, ...filtered];

      localStorage.setItem("moviez:recent", JSON.stringify(next.slice(0, 10)));
    } catch (error) {
      console.error("RECENT SAVE ERROR:", error);
    }
  }, [movie]);

  // =========================================================
  // GET SAVED PROGRESS
  // =========================================================

  const getSavedProgress = useCallback(() => {
    if (!id) return 0;

    try {
      const saved = localStorage.getItem("moviez:recent");

      if (!saved) return 0;

      const recent = JSON.parse(saved);

      if (!Array.isArray(recent)) {
        return 0;
      }

      const found = recent.find((item) => String(item.id) === String(id));

      if (found && typeof found.progress === "number") {
        return found.progress;
      }

      return 0;
    } catch {
      return 0;
    }
  }, [id]);

  // =========================================================
  // VIDKING IFRAME LOAD
  // =========================================================

  const handleIframeLoad = useCallback(() => {
    console.log("🔥 VIDKING IFRAME LOADED");
  }, []);

  // =========================================================
  // VIDKING MESSAGE LISTENER
  //
  // ONLY FOR CURRENT TIME / PROGRESS
  //
  // NO SUBTITLE POSTMESSAGE
  // =========================================================

  useEffect(() => {
    if (!id) return;

    let latestTime = 0;
    let latestProgress = 0;
    let latestMovieId = null;

    const savedProgress = getSavedProgress();

    console.log("💾 SAVED PROGRESS:", savedProgress);

    // =======================================================
    // MESSAGE HANDLER
    // =======================================================

    const handleMessage = (event) => {
      if (event.origin !== "https://www.vidking.net") {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      let message = event.data;

      if (typeof message === "string") {
        try {
          message = JSON.parse(message);
        } catch {
          return;
        }
      }

      if (!message) return;

      // =====================================================
      // PLAYER EVENT
      // =====================================================

      if (message.type === "PLAYER_EVENT") {
        const data = message.data;

        if (!data) return;

        if (
          data.currentTime !== undefined &&
          Number.isFinite(Number(data.currentTime))
        ) {
          latestTime = Number(data.currentTime);
        }

        if (
          data.progress !== undefined &&
          Number.isFinite(Number(data.progress))
        ) {
          latestProgress = Number(data.progress);
        }

        if (data.id !== undefined) {
          latestMovieId = String(data.id);
        }

        console.log("⏱ CURRENT TIME:", latestTime);

        console.log("📊 PROGRESS:", latestProgress);

        console.log("🎬 MOVIE ID:", latestMovieId);
      }

      // =====================================================
      // MEDIA DATA
      // =====================================================

      if (message.type === "MEDIA_DATA") {
        const data = message.data;

        console.log("🎬 VIDKING MEDIA DATA:", data);

        if (data?.id !== undefined) {
          latestMovieId = String(data.id);
        }

        if (data?.progress && typeof data.progress === "object") {
          if (typeof data.progress.currentTime === "number") {
            latestTime = data.progress.currentTime;
          }

          if (typeof data.progress.progress === "number") {
            latestProgress = data.progress.progress;
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // =====================================================
    // SAVE EVERY 10 SECONDS
    // =====================================================

    const interval = setInterval(() => {
      setCurrentTime(latestTime);

      setProgress(latestProgress);

      if (!latestMovieId) {
        console.log("⏳ No movie ID yet");

        return;
      }

      try {
        const saved = localStorage.getItem("moviez:recent");

        if (!saved) return;

        const recent = JSON.parse(saved);

        if (!Array.isArray(recent)) {
          return;
        }

        const updated = recent.map((recentMovie) => {
          if (String(recentMovie.id) !== latestMovieId) {
            return recentMovie;
          }

          return {
            ...recentMovie,

            progress: latestProgress,

            currentTime: latestTime,

            updatedAt: Date.now(),
          };
        });

        localStorage.setItem("moviez:recent", JSON.stringify(updated));

        console.log("💾 PROGRESS SAVED:", latestProgress);

        console.log("⏱ CURRENT TIME SAVED:", latestTime);
      } catch (error) {
        console.error("❌ PROGRESS SAVE ERROR:", error);
      }
    }, 10000);

    return () => {
      window.removeEventListener("message", handleMessage);

      clearInterval(interval);
    };
  }, [id, getSavedProgress]);

  // =========================================================
  // DEBUG
  // =========================================================

  useEffect(() => {
    console.log("⏱ CURRENT TIME STATE:", currentTime);

    console.log("📊 PROGRESS STATE:", progress);
  }, [currentTime, progress]);

  // =========================================================
  // DIRECTOR
  // =========================================================

  const director = credits?.crew?.find((person) => person.job === "Director");

  // =========================================================
  // WRITERS
  // =========================================================

  const writers = credits?.crew?.filter(
    (person) =>
      person.department === "Writing" ||
      person.job === "Writer" ||
      person.job === "Screenplay",
  );

  // =========================================================
  // STARS
  // =========================================================

  const stars = credits?.cast?.slice(0, 3);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
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
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <div className="mt-12 mb-8 w-full max-w-6xl px-4">
        {/* ================================================= */}
        {/* TITLE + RATING */}
        {/* ================================================= */}

        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold leading-10 tracking-tight text-[var(--foreground)]">
              {movie.title}
            </h1>

            <p className="mt-1 text-lg font-extralight text-[var(--foreground)]">
              {movie.release_date} · {movie.runtime}m
            </p>
          </div>

          <div>
            <span className="text-xs text-[var(--foreground)]">Rating</span>

            <div className="flex items-center gap-1">
              <div className="flex flex-col">
                <div className="flex items-end">
                  <span className="text-xl text-yellow-400 sm:text-2xl">★</span>

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

        {/* ================================================= */}
        {/* POSTER + BACKDROP */}
        {/* ================================================= */}

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
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setIsMovieOpen(false)}
        >
          <div
            className="mx-auto flex min-h-full w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
              {/* ================================================= */}
              {/* CLOSE */}
              {/* ================================================= */}

              <button
                onClick={() => setIsMovieOpen(false)}
                className="absolute right-4 top-4 z-50 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-white transition-all hover:bg-black"
              >
                ✕ Close
              </button>

              {/* ================================================= */}
              {/* VIDKING */}
              {/* ================================================= */}

              <div className="aspect-video w-full">
                <iframe
                  ref={iframeRef}
                  className="h-full w-full"
                  src={`https://www.vidking.net/embed/movie/${id}`}
                  title={movie.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                />
              </div>

              {/* ================================================= */}
              {/* MONGOLIAN SUBTITLE */}
              {/* ================================================= */}

              <div className="border-t border-white/10 bg-[#111111] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* LEFT */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                      <Subtitles size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Монгол хадмал
                      </p>

                      {subtitleLoading ? (
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <Loader2 size={13} className="animate-spin" />

                          <span>Subtitle шалгаж байна...</span>
                        </div>
                      ) : subtitleUrl ? (
                        <p className="mt-1 text-xs text-gray-400">
                          Монгол subtitle бэлэн байна
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-400">
                          {subtitleError || "Монгол subtitle олдсонгүй."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DOWNLOAD BUTTON */}

                  {subtitleUrl && (
                    <button
                      onClick={downloadSubtitle}
                      className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                      <Download size={17} />

                      {subtitleDownloaded
                        ? "Дахин татах"
                        : "Монгол хадмал татах"}
                    </button>
                  )}
                </div>
                {/* ================================================= */}
                {/* INSTRUCTION */}
                {/* ================================================= */}

                {subtitleUrl && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    {/* TITLE */}

                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                        ?
                      </div>

                      <p className="text-sm font-semibold text-white">
                        Хэрхэн ашиглах вэ?
                      </p>
                    </div>

                    {/* STEPS */}

                    <div className="flex flex-col gap-3">
                      {/* STEP 1 */}

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                          1
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Монгол subtitle татах
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Дээрх{" "}
                            <span className="font-medium text-gray-300">
                              Download Монгол хадмал
                            </span>{" "}
                            товчийг дарна уу.
                          </p>
                        </div>
                      </div>

                      {/* LINE */}

                      <div className="ml-3 h-3 w-px bg-white/10" />

                      {/* STEP 2 */}

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                          2
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Киногоо эхлүүлэх
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Киноны player дээр{" "}
                            <span className="font-medium text-gray-300">
                              Тоглуулах товч дээр
                            </span>{" "}
                            дарна уу.
                          </p>
                        </div>
                      </div>

                      {/* LINE */}

                      <div className="ml-3 h-3 w-px bg-white/10" />

                      {/* STEP 3 */}

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                          3
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Custom Subtitle сонгох
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            VidKing player-ийн{" "}
                            <span className="inline-flex items-center gap-1 align-middle text-gray-300">
                              <Captions size={14} className="shrink-0" />
                              хэсэг
                            </span>{" "}
                            рүү орж татсан{" "}
                            <span className="font-medium text-gray-300">
                              .vtt файлаа
                            </span>{" "}
                            <span className="font-medium text-gray-300">
                              Upload Custom Subtitle хэсэг
                            </span>{" "}
                            дээр дарж байрлуулна уу.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

        {/* INFO */}

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
              {writers?.map((writer) => writer.name).join(" · ") || "Unknown"}
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
  );
}
