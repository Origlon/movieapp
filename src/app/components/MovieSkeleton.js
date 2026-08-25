export const MovieSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-2/3 w-full rounded-lg bg-gray-200" />

      <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />

      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
    </div>
  );
};