"use client";
{/* eslint-disable @next/next/no-img-element */}


import { useState } from "react";

const heroMovies = [
  {
    image: "/pictures/image1.jpg",
    title: "Wicked",
    rating: "6.9/10",
    description:
      "Elphaba, a misunderstood young woman because of her green skin, and Glinda, a popular girl, become friends at Shiz University in the Land of Oz.",
  },
  {
    image: "/pictures/image2.png",
    title: "Gladiator II",
    rating: "6.9/10",
    description:
      "After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people.",
  },
  {
    image: "/pictures/image3.jpg",
    title: "Moana 2",
    rating: "6.9/10",
    description:
      "After receiving an unexpected call from her wayfinding ancestors, Moana must journey to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroMovies.length);
  };

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + heroMovies.length) % heroMovies.length
    );
  };

  return (
    <div className="relative aspect-1440/600 w-full overflow-hidden">

      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {heroMovies.map((movie) => (
          <div
            key={movie.title}
            className="relative h-full min-w-full shrink-0"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />

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
                  {movie.rating}
                </span>
              </div>

              <p className="mb-5 text-xs leading-4 sm:text-sm">
                {movie.description}
              </p>

              <button className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm text-black transition-transform duration-200 hover:scale-110">
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
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "w-6 bg-white"
                : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};