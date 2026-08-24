import { MovieSkeleton } from "./MovieSkeleton";

export const MovieSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
};