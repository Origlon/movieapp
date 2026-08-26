"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { HeaderLogo } from "../icon/Headerlogo";

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
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  const router = useRouter();

  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  // SEARCH
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

  // THEME + WATCHLIST LOAD
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    const savedWatchlist = localStorage.getItem("watchlist");

    if (savedWatchlist) {
      try {
        const list = JSON.parse(savedWatchlist);

        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWatchlistCount(0);
      }
    } else {
      setWatchlistCount(0);
    }
  }, []);

  // THEME TOGGLE
  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const next = !prev;

      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return next;
    });
  };


  useEffect(() => {
    const updateWatchlistCount = () => {
      try {
        const saved = localStorage.getItem("moviez:watchlist");

        if (!saved) {
          setWatchlistCount(0);
          return;
        }

        const list = JSON.parse(saved);

        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWatchlistCount(0);
      }
    };

    // Эхний удаа уншина
    updateWatchlistCount();

    // Heart дарахад шууд дахин уншина
    window.addEventListener("watchlistChanged", updateWatchlistCount);

    return () => {
      window.removeEventListener("watchlistChanged", updateWatchlistCount);
    };
  }, []);

  return (
    <header className="relative z-50 w-full bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="relative flex items-center justify-between gap-4">
          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            className="flex shrink-0 cursor-pointer items-center gap-2"
          >
            <HeaderLogo />

            <span className="text-xl font-bold italic text-[#4338CA]">
              MovieZ
            </span>
          </div>

          {/* GENRE + SEARCH + WATCHLIST */}
          <div
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* GENRE */}
            <button
              onClick={() => setIsGenreOpen((prev) => !prev)}
              className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-[#E4E4E7] bg-[var(--background)] px-4 text-[var(--foreground)]"
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

            {/* SEARCH */}
            <div className="relative w-94.75">
              <Search
                size={16}
                strokeWidth={2}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-white" : "text-[#09090B]"
                }`}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    router.push(`/search/${encodeURIComponent(search.trim())}`);

                    setSearch("");
                    setSuggestions([]);
                  }
                }}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-[#E4E4E7] bg-(--background) pl-10 pr-3 text-[var(--foreground)] outline-none placeholder:text-gray-500"
              />

              {/* SEARCH SUGGESTIONS */}
              {search.trim() && (
                <div className="absolute left-0 top-11 z-50 w-full rounded-lg border border-[#E4E4E7] bg-[var(--background)] p-2 text-[var(--foreground)] shadow-lg"></div>
              )}
            </div>

            <button
              onClick={() => router.push("/watchlist")}
              className="relative flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[#E4E4E7] bg-[var(--background)] px-3 text-[var(--foreground)] transition hover:border-red-500 hover:text-red-500"
              title="Watchlist"
            >
              <Heart size={17} strokeWidth={2} />

              <span className="text-sm font-medium">Watchlist</span>

              {watchlistCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleThemeToggle}
            className="ml-auto flex h-9 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#E4E4E7] bg-[var(--background)] text-[var(--foreground)]"
          >
            {isDark ? (
              <Sun size={16} strokeWidth={2} />
            ) : (
              <Moon size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* GENRE DROPDOWN */}
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
            bg-(--background)
            p-5
            text-(--foreground)
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
                className="
                  flex
                  h-5
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-(--foreground)
                  px-2.5
                  py-0.5
                  text-xs
                  font-bold
                  text-(--foreground)
                  transition-colors
                  hover:border-[#4338CA]
                  hover:text-[#4338CA]
                "
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
