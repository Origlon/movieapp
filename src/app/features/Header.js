"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { HeaderLogo } from "../icon/Headerlogo";
import { LightLogo } from "../icon/LightLogo";
import { Search } from "../icon/Search";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const Header = () => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  const searchMovies = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          search.trim(),
        )}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${api_token}`,
          },
        },
      );

      const data = await response.json();

      setSuggestions(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  return (
    <header className="relative z-50 w-full border-b border-[#E4E4E7] bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div
            onClick={() => router.push("/")}
            className="flex shrink-0 cursor-pointer items-center gap-2"
          >
            <HeaderLogo />

            <span className="text-xl font-bold italic text-[#4338CA]">
              MovieZ
            </span>
          </div>

          <div
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    router.push(`/search/${encodeURIComponent(search.trim())}`);
                  }
                }}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-[#E4E4E7] pl-10 pr-3 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {search.trim() && (
                <div className="absolute left-0 top-11 z-50 w-full rounded-lg border border-[#E4E4E7] bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  {isSearching ? (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Searching...
                    </p>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.slice(0, 4).map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => {
                            setSearch("");
                            setSuggestions([]);
                            router.push(`/detail/${movie.id}`);
                          }}
                          className="flex cursor-pointer gap-3 rounded-md p-2 hover:bg-gray-100"
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "/placeholder.jpg"
                            }
                            alt={movie.title}
                            className="h-14 w-10 rounded object-cover"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {movie.title}
                            </p>

                            <p className="text-xs text-gray-500">
                              {movie.release_date?.slice(0, 4)}
                            </p>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          router.push(
                            `/search/${encodeURIComponent(search.trim())}`,
                          );
                          setSearch("");
                          setSuggestions([]);
                        }}
                        className="mt-1 w-full border-t border-[#E4E4E7] px-3 py-3 text-left text-sm font-medium text-[#4338CA] hover:bg-gray-50"
                      >
                        See all results for &quot;{search}&quot;
                      </button>
                    </>
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      No movies found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              const newTheme = isDark ? "light" : "dark";

              setIsDark(!isDark);

              if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
              }
            }}
            className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] dark:border-gray-700"
          >
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
                key={genre.id}
                onClick={() => {
                  setIsGenreOpen(false);
                  router.push(`/genre/${genre.id}`);
                }}
                className="flex h-5 items-center gap-2 rounded-full border border-[#E4E4E7] px-2.5 py-0.5 text-xs font-bold text-gray-700 transition-colors hover:border-[#4338CA] hover:text-[#4338CA]"
              >
                <span>{genre.name}</span>

                <ChevronRight size={14} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
