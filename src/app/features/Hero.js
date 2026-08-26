"use client";

import { useState, useEffect } from "react";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

export const Hero = () => {
  const [nowPlayingData, setNowPlayingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [current, setCurrent] = useState(0);

  const [trailer, setTrailer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // =========================
  // WHEEL / TRACKPAD
  // =========================

  const handleWheel = (e) => {
    if (nowPlayingData.length === 0) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 30) {
        nextSlide();
      } else if (e.deltaX < -30) {
        prevSlide();
      }
    }
  };

  // =========================
  // GET NOW PLAYING
  // =========================

  const getData = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Movie API error");
    }

    const jsonData = await response.json();

    return jsonData.results;
  };

  // =========================
  // GET VIDEOS
  // =========================

  const getVideos = async (id) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
          accept: "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.status_message || "Videos API error");
    }

    return data.results || [];
  };

  // =========================
  // TRAILER
  // =========================

  const handleTrailer = async (movieId) => {
    try {
      const videos = await getVideos(movieId);

      const youtubeVideos = videos.filter(
        (video) => video.site === "YouTube" && video.key,
      );

      const trailerVideo =
        youtubeVideos.find(
          (video) => video.type === "Trailer" && video.official === true,
        ) ||
        youtubeVideos.find((video) => video.type === "Trailer") ||
        youtubeVideos.find((video) => video.type === "Teaser");

      if (!trailerVideo) {
        alert("Trailer олдсонгүй");
        return;
      }

      setTrailer(trailerVideo);
      setIsPlaying(true);
    } catch (error) {
      console.error("TRAILER ERROR:", error);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    getData()
      .then((data) => {
        setNowPlayingData(data.slice(0, 5));
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================
  // SLIDES
  // =========================

  const nextSlide = () => {
    if (nowPlayingData.length === 0) return;

    setCurrent((prev) => (prev + 1) % nowPlayingData.length);
  };

  const prevSlide = () => {
    if (nowPlayingData.length === 0) return;

    setCurrent(
      (prev) => (prev - 1 + nowPlayingData.length) % nowPlayingData.length,
    );
  };

  // =========================
  // CLOSE TRAILER
  // =========================

  const closeTrailer = () => {
    setIsPlaying(false);
    setTrailer(null);
  };

  return (
    <div className="w-full">
      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {loading && (
        <div
          onWheel={handleWheel}
          className="
            flex
            h-[430px]
            w-full
            items-center
            justify-center
            bg-gray-200

            sm:aspect-[1440/500]
            sm:h-auto
          "
        >
          Loading...
        </div>
      )}

      {/* ========================= */}
      {/* ERROR */}
      {/* ========================= */}

      {!loading && errorMessage && (
        <div
          className="
            flex
            h-[430px]
            w-full
            items-center
            justify-center
            bg-black
            text-white

            sm:aspect-[1440/500]
            sm:h-auto
          "
        >
          {errorMessage}
        </div>
      )}

      {/* ========================= */}
      {/* EMPTY */}
      {/* ========================= */}

      {!loading && !errorMessage && nowPlayingData.length === 0 && (
        <div
          className="
              flex
              h-[430px]
              w-full
              items-center
              justify-center
              bg-black
              text-white

              sm:aspect-[1440/500]
              sm:h-auto
            "
        >
          No movies found
        </div>
      )}

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      {!loading && !errorMessage && nowPlayingData.length > 0 && (
        <div
          onWheel={handleWheel}
          className="
              relative
              h-[430px]
              w-full
              overflow-hidden

              sm:aspect-[1440/500]
              sm:h-auto
            "
        >
          {/* SLIDER */}

          <div className="relative h-full w-full overflow-hidden">
            <div
              className="
                  flex
                  h-full
                  w-full
                  transition-transform
                  duration-700
                  ease-in-out
                "
              style={{
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {nowPlayingData.map((movie) => (
                <div
                  key={movie.id}
                  className="
                      relative
                      h-full
                      min-w-full
                      shrink-0
                    "
                >
                  {/* BACKDROP */}

                  <img
                    src={
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : "/pictures/placeholder.jpg"
                    }
                    alt={movie.title}
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover

                        object-[60%_center]

                        sm:object-center
                      "
                  />

                  {/* DARK OVERLAY */}

                  <div className="absolute inset-0 bg-black/50" />

                  {/* LEFT GRADIENT */}

                  <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-black/80
                        via-black/40
                        to-transparent
                      "
                  />

                  {/* CONTENT */}

                  <div
                    className="
                        absolute
                        left-5
                        top-1/2
                        w-[calc(100%-40px)]
                        -translate-y-1/2
                        text-white

                        sm:left-[8%]
                        sm:w-[80%]
                        sm:max-w-100
                      "
                  >
                    {/* NOW PLAYING */}

                    <p
                      className="
                          mb-1
                          text-xs
                          font-medium
                          text-white/80

                          sm:text-sm
                        "
                    >
                      Now Playing:
                    </p>

                    {/* TITLE */}

                    <h1
                      className="
                          line-clamp-2
                          text-2xl
                          font-bold
                          leading-tight

                          sm:text-3xl
                          md:text-4xl
                        "
                    >
                      {movie.title}
                    </h1>

                    {/* RATING */}

                    <div
                      className="
                          my-2
                          flex
                          items-center
                          gap-1
                        "
                    >
                      <span
                        className="
                            text-lg
                            text-yellow-400

                            sm:text-2xl
                          "
                      >
                        ★
                      </span>

                      <span
                        className="
                            text-xs

                            sm:text-sm
                          "
                      >
                        {movie.vote_average?.toFixed(1)}
                        /10
                      </span>
                    </div>

                    {/* OVERVIEW */}

                    <p
                      className="
                          mb-4
                          line-clamp-3
                          text-xs
                          leading-4
                          text-white/90

                          sm:mb-5
                          sm:text-sm
                          sm:leading-5
                        "
                    >
                      {movie.overview}
                    </p>

                    {/* TRAILER BUTTON */}

                    <button
                      onClick={() => handleTrailer(movie.id)}
                      className="
                          flex
                          items-center
                          gap-2
                          rounded-md
                          bg-white
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-black
                          transition-transform
                          duration-200
                          hover:scale-105

                          sm:px-4
                          sm:py-2
                          sm:text-sm
                        "
                    >
                      ▶ Watch Trailer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ========================= */}
            {/* PREVIOUS */}
            {/* ========================= */}

            <button
              onClick={prevSlide}
              aria-label="Previous movie"
              className="
                  absolute
                  left-3
                  top-1/2
                  z-10
                  flex
                  h-8
                  w-8
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-sm
                  text-black
                  transition
                  hover:bg-white

                  sm:left-5
                  sm:h-10
                  sm:w-10
                  sm:text-base
                "
            >
              ←
            </button>

            {/* ========================= */}
            {/* NEXT */}
            {/* ========================= */}

            <button
              onClick={nextSlide}
              aria-label="Next movie"
              className="
                  absolute
                  right-3
                  top-1/2
                  z-10
                  flex
                  h-8
                  w-8
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/80
                  text-sm
                  text-black
                  transition
                  hover:bg-white

                  sm:right-5
                  sm:h-10
                  sm:w-10
                  sm:text-base
                "
            >
              →
            </button>

            {/* ========================= */}
            {/* DOTS */}
            {/* ========================= */}

            <div
              className="
                  absolute
                  bottom-4
                  left-1/2
                  z-10
                  flex
                  -translate-x-1/2
                  gap-1.5

                  sm:bottom-8
                  sm:gap-2
                "
            >
              {nowPlayingData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`
                      h-1.5
                      rounded-full
                      transition-all

                      ${
                        current === index
                          ? "w-5 bg-white sm:w-6"
                          : "w-1.5 bg-white/40"
                      }
                    `}
                />
              ))}
            </div>
          </div>

          {/* ========================= */}
          {/* TRAILER MODAL */}
          {/* ========================= */}

          {isPlaying && trailer && (
            <div
              className="
                  fixed
                  inset-0
                  z-[999]
                  flex
                  items-center
                  justify-center
                  bg-black/80
                  p-3
                  backdrop-blur-md

                  sm:p-8
                "
              onClick={closeTrailer}
            >
              <div
                className="
                    relative
                    aspect-video
                    w-full
                    max-w-5xl
                    overflow-hidden
                    rounded-xl
                    bg-black
                    shadow-2xl

                    sm:rounded-2xl
                  "
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeTrailer}
                  className="
                      absolute
                      right-2
                      top-2
                      z-50
                      rounded-full
                      bg-black/70
                      px-2.5
                      py-1
                      text-[10px]
                      text-white
                      transition
                      hover:bg-black

                      sm:right-4
                      sm:top-4
                      sm:px-3
                      sm:py-1.5
                      sm:text-xs
                    "
                >
                  ✕ Close
                </button>

                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title={trailer.name}
                  allow="
                      accelerometer;
                      autoplay;
                      clipboard-write;
                      encrypted-media;
                      gyroscope;
                      picture-in-picture
                    "
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
