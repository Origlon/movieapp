import { MovieCard } from "./Moviecard";

export const MovieSection = ({
  title,
  movies,
}) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <button className="flex items-center gap-2 text-sm font-semibold">
          See More
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={index}
            image={movie.image}
            title={movie.title}
            rating={movie.rating}
          />
        ))}
      </div>
    </section>
  );
};