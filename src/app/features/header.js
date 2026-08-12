"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { HeaderLogo } from "../icon/Headerlogo";
import { LightLogo } from "../icon/LightLogo";
import { Search } from "../icon/Search";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "Game-Show",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "News",
  "Reality-TV",
  "Romance",
  "Science Fiction",
  "Short",
  "Sport",
  "Talk show",
  "Thriller",
  "War",
  "Western",
];

export const Header = () => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  return (
    <header className="relative z-50 w-full border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <HeaderLogo />

            <span className="text-xl font-bold italic text-[#4338CA]">
              MovieZ
            </span>
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
            <button
              onClick={() => setIsGenreOpen((prev) => !prev)}
              className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-[#E4E4E7] bg-white px-4"
            >
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-200 ${
                  isGenreOpen ? "rotate-180" : ""
                }`}
              />
              <span>Genre</span>
            </button>

            <div className="relative w-94.75">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-[#E4E4E7] pl-10 pr-3 outline-none"
              />
            </div>
          </div>

          <button className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7]">
            <LightLogo />
          </button>
        </div>
      </div>

      {isGenreOpen && (
        <div
          className="
            fixed
            left-1/2
            top-18
            z-999
            h-83.25
            w-144.25
            max-w-[calc(100vw-32px)]
            -translate-x-1/2
            rounded-lg
            border
            border-[#E4E4E7]
            bg-white
            p-5
            shadow-lg
          "
        >
          <h3 className="text-lg font-semibold">Genres</h3>

          <p className="mt-1 text-sm text-gray-500">
            See lists of movies by genre
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setIsGenreOpen(false)}
                className="flex h-5 items-center gap-2 rounded-full border border-[#E4E4E7] px-2.5 py-0.5 text-xs font-bold text-gray-700 transition-colors hover:border-[#4338CA] hover:text-[#4338CA]"
              >
                <span>{genre}</span>

                <ChevronRight size={14} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
