import { MovieSkeleton } from "./MovieSkeleton";

export const MovieSectionSkeleton = () => {
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />

        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};
