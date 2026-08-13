export const HeroSkeleton = () => {
  return (
    <div className="relative aspect-[1440/600] w-full overflow-hidden bg-gray-200 animate-pulse">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content skeleton */}
      <div className="absolute left-[8%] top-1/2 w-[80%] max-w-[400px] -translate-y-1/2">
        {/* Now Playing */}
        <div className="h-4 w-24 rounded bg-gray-300" />

        {/* Title */}
        <div className="mt-3 h-10 w-64 rounded bg-gray-300" />

        {/* Rating */}
        <div className="my-3 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-300" />
          <div className="h-4 w-16 rounded bg-gray-300" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-300" />
          <div className="h-3 w-[90%] rounded bg-gray-300" />
          <div className="h-3 w-[70%] rounded bg-gray-300" />
        </div>

        {/* Button */}
        <div className="mt-5 h-10 w-36 rounded bg-gray-300" />
      </div>

      {/* Previous button */}
      <div className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-300 sm:left-5 sm:h-10 sm:w-10" />

      {/* Next button */}
      <div className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-300 sm:right-5 sm:h-10 sm:w-10" />

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
        <div className="h-2 w-6 rounded-full bg-gray-300" />
        <div className="h-2 w-2 rounded-full bg-gray-300" />
        <div className="h-2 w-2 rounded-full bg-gray-300" />
      </div>
    </div>
  );
};