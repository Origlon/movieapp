"use client";

import { MovieCard } from "./Moviecard";
import { useRouter } from "next/navigation";
import { MoveLeft, MoveRight } from "lucide-react";

export const MovieSection = ({ title, movies, path, isDetailPage = false }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (isDetailPage) {
      router.back();
    } else {
      router.push(path);
    }
  };
  const handleMovieClick = (movie) => {
router.push(`/detail/${movie.id}`)
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">{title}</h2>

        <button
          className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
          onClick={handleButtonClick}
        >
          {isDetailPage ? (
            <>
              <MoveLeft size={18} />
              Back
            </>
          ) : (
            <>
              See More
              <MoveRight size={18} />
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <div
            key={movie.id || movie.title}
            onClick={() => handleMovieClick(movie)}
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <MovieCard
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : movie.image
              }
              title={movie.title}
              rating={
                movie.vote_average !== undefined
                  ? movie.vote_average.toFixed(1)
                  : movie.rating
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};
