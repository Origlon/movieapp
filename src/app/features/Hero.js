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
  const getData = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
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
          accept: "application/json",
        },
      },
    );

    console.log("VIDEO STATUS:", response.status);
    console.log("VIDEO OK:", response.ok);

    const data = await response.json();

    console.log("VIDEO RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.status_message || "Videos API error");
    }

    return data.results || [];
  };

  const handleTrailer = async (movieId) => {
    try {
      console.log("CLICKED MOVIE:", movieId);

      const videos = await getVideos(movieId);

      console.log("ALL VIDEOS:", videos);

      const youtubeVideos = videos.filter(
        (video) => video.site === "YouTube" && video.key,
      );

      console.log("YOUTUBE VIDEOS:", youtubeVideos);

      const trailerVideo =
        youtubeVideos.find(
          (video) => video.type === "Trailer" && video.official === true,
        ) ||
        youtubeVideos.find((video) => video.type === "Trailer") ||
        youtubeVideos.find((video) => video.type === "Teaser");

      console.log("SELECTED VIDEO:", trailerVideo);

      if (!trailerVideo) {
        alert("Trailer олдсонгүй");
        return;
      }

      console.log("YOUTUBE KEY:", trailerVideo.key);

      setTrailer(trailerVideo);
      setIsPlaying(true);
    } catch (error) {
      console.error("TRAILER ERROR:", error);
    }
  };
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

  const closeTrailer = () => {
    setIsPlaying(false);
    setTrailer(null);
  };

  return (
    <div>
      {loading && (
        <div className="flex aspect-1440/500 w-full items-center justify-center bg-gray-200"
        onWheel={handleWheel}>
          Loading...
        </div>
      )}

      {!loading && errorMessage && (
        <div className="flex aspect-1440/500 w-full items-center justify-center bg-black text-white">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && nowPlayingData.length === 0 && (
        <div className="flex aspect-1440/500 w-full items-center justify-center bg-black text-white">
          No movies found
        </div>
      )}

      {!loading && !errorMessage && nowPlayingData.length > 0 && (
        <div className="relative aspect-1440/500 w-full">
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {nowPlayingData.map((movie) => (
                <div
                  key={movie.id}
                  className="relative h-full min-w-full shrink-0"
                >
                  <img
                    src={
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : "/pictures/placeholder.jpg"
                    }
                    alt={movie.title}
                    className="absolute inset-0 h-full w-full object-cover object-[center_-0%]"
                  />

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute left-[8%] top-1/2 w-[80%] max-w-100 -translate-y-1/2 text-white">
                    <p className="text-sm">Now Playing:</p>

                    <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                      {movie.title}
                    </h1>

                    <div className="my-2 flex items-center gap-1">
                      <span className="text-xl text-yellow-400 sm:text-2xl">
                        ★
                      </span>

                      <span className="text-sm">
                        {movie.vote_average?.toFixed(1)}/10
                      </span>
                    </div>

                    <p className="mb-5 text-xs leading-4 sm:text-sm">
                      {movie.overview}
                    </p>

                    <button
                      onClick={() => handleTrailer(movie.id)}
                      className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm text-black transition-transform duration-200 hover:scale-110"
                    >
                      ▶ Watch Trailer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black hover:bg-white sm:left-5 sm:h-10 sm:w-10"
            >
              ←
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black hover:bg-white sm:right-5 sm:h-10 sm:w-10"
            >
              →
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
              {nowPlayingData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {isPlaying && trailer && (
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
              onClick={closeTrailer}
            >
              <div
                className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeTrailer}
                  className="absolute right-4 top-4 z-50 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white transition hover:bg-black"
                >
                  ✕ Close
                </button>

                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
