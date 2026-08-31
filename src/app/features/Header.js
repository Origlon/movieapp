"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Heart,
  X,
  Clock,
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
  const [searches, setSearches] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [isDark, setIsDark] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const genreRef = useRef(null);
  const inputRef = useRef(null);

  const router = useRouter();

  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  // =========================
  // LOAD SEARCH HISTORY
  // =========================

  useEffect(() => {
    try {
      const saved = localStorage.getItem("moviez:searches");

      if (!saved) {
        setSearches([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setSearches(parsed.slice(0, 8));
      } else {
        setSearches([]);
      }
    } catch {
      setSearches([]);
    }
  }, []);

  // =========================
  // SAVE SEARCH HISTORY
  // =========================

  const saveSearch = (query) => {
    const trimmed = query.trim();

    if (!trimmed) return;

    const filtered = searches.filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    );

    const updated = [trimmed, ...filtered].slice(0, 8);

    setSearches(updated);

    localStorage.setItem("moviez:searches", JSON.stringify(updated));
  };

  // =========================
  // REMOVE ONE SEARCH
  // =========================

  const removeSearch = (query) => {
    const updated = searches.filter((item) => item !== query);

    setSearches(updated);

    if (updated.length === 0) {
      localStorage.removeItem("moviez:searches");
    } else {
      localStorage.setItem("moviez:searches", JSON.stringify(updated));
    }

    setHighlightedIndex(-1);
  };

  // =========================
  // CLEAR ALL SEARCHES
  // =========================

  const clearSearches = () => {
    localStorage.removeItem("moviez:searches");
    setSearches([]);
    setHighlightedIndex(-1);
  };

  // =========================
  // SEARCH MOVIES
  // =========================

  const searchMovies = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      setIsSearching(false);
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

  // =========================
  // SEARCH DEBOUNCE
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // OUTSIDE CLICK
  // =========================

  useEffect(() => {
    const handleMouseDown = (event) => {
      const clickedSearch =
        searchRef.current && searchRef.current.contains(event.target);

      const clickedGenre =
        genreRef.current && genreRef.current.contains(event.target);

      if (!clickedSearch && !clickedGenre) {
        setIsSearchFocused(false);
        setIsGenreOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // =========================
  // THEME
  // =========================

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // =========================
  // WATCHLIST COUNT
  // =========================

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

    updateWatchlistCount();

    window.addEventListener("watchlistChanged", updateWatchlistCount);

    return () => {
      window.removeEventListener("watchlistChanged", updateWatchlistCount);
    };
  }, []);

  // =========================
  // THEME TOGGLE
  // =========================

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

  // =========================
  // OPEN MOBILE SEARCH
  // =========================

  const handleOpenMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setIsGenreOpen(false);
    setIsSearchFocused(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // =========================
  // CLOSE MOBILE SEARCH
  // =========================

  const handleCloseMobileSearch = () => {
    setSearch("");
    setSuggestions([]);
    setIsGenreOpen(false);
    setIsSearchFocused(false);
    setHighlightedIndex(-1);
    setIsMobileSearchOpen(false);
  };

  // =========================
  // RUN HISTORY SEARCH
  // =========================

  const handleHistoryClick = (query) => {
    saveSearch(query);

    setSearch("");
    setSuggestions([]);
    setIsSearchFocused(false);
    setHighlightedIndex(-1);
    setIsMobileSearchOpen(false);
    setIsGenreOpen(false);

    router.push(`/search/${encodeURIComponent(query)}`);
  };

  // =========================
  // OPEN MOVIE
  // =========================

  const handleMovieClick = (movie) => {
    // Search result click = committed search
    saveSearch(search);

    setSearch("");
    setSuggestions([]);
    setIsSearchFocused(false);
    setHighlightedIndex(-1);
    setIsMobileSearchOpen(false);
    setIsGenreOpen(false);

    router.push(`/detail/${movie.id}`);
  };

  // =========================
  // ENTER SEARCH
  // =========================

  const handleSearchSubmit = (e) => {
    if (e.key === "Escape") {
      setIsSearchFocused(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (search.trim()) {
        if (suggestions.length === 0) return;

        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else {
        if (searches.length === 0) return;

        setHighlightedIndex((prev) =>
          prev < searches.length - 1 ? prev + 1 : 0,
        );
      }

      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (search.trim()) {
        if (suggestions.length === 0) return;

        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else {
        if (searches.length === 0) return;

        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : searches.length - 1,
        );
      }

      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      // Empty input = history
      if (!search.trim()) {
        if (highlightedIndex >= 0 && highlightedIndex < searches.length) {
          handleHistoryClick(searches[highlightedIndex]);
        }

        return;
      }

      // Text input = live results
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleMovieClick(suggestions[highlightedIndex]);

        return;
      }

      // No highlighted result = normal search
      saveSearch(search);

      router.push(`/search/${encodeURIComponent(search.trim())}`);

      setSearch("");
      setSuggestions([]);
      setIsSearchFocused(false);
      setHighlightedIndex(-1);
      setIsMobileSearchOpen(false);
      setIsGenreOpen(false);
    }
  };

  // =========================
  // RESET HIGHLIGHT WHEN SEARCH CHANGES
  // =========================

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  // =========================
  // DROPDOWN MODES
  // =========================

  const showRecentSearches =
    isSearchFocused && search.trim() === "" && searches.length > 0;

  const showSearchResults = isSearchFocused && search.trim() !== "";

  return (
    <header className="relative z-50 w-full bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="relative flex h-9 items-center justify-between">
          {/* ========================= */}
          {/* LOGO */}
          {/* ========================= */}

          <div
            onClick={() => router.push("/")}
            className={`
              flex
              shrink-0
              cursor-pointer
              items-center
              gap-2
              ${isMobileSearchOpen ? "hidden md:flex" : "flex"}
            `}
          >
            <HeaderLogo />

            <span className="text-xl font-bold italic text-[#4338CA]">
              MovieZ
            </span>
          </div>

          {/* ========================= */}
          {/* CENTER CONTROLS */}
          {/* ========================= */}

          <div
            className={`
              flex
              items-center
              gap-2

              ${isMobileSearchOpen ? "absolute inset-0 w-full" : "ml-auto"}

              md:absolute
              md:left-1/2
              md:top-1/2
              md:w-auto
              md:-translate-x-1/2
              md:-translate-y-1/2
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========================= */}
            {/* MOBILE SEARCH ICON */}
            {/* ========================= */}

            {!isMobileSearchOpen && (
              <button
                type="button"
                onClick={handleOpenMobileSearch}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[#E4E4E7]
                  text-[var(--foreground)]
                  md:hidden
                "
              >
                <Search size={16} strokeWidth={2} />
              </button>
            )}

            {/* ========================= */}
            {/* GENRE */}
            {/* ========================= */}

            <div
              ref={genreRef}
              className={`
                relative
                shrink-0

                ${isMobileSearchOpen ? "flex" : "hidden md:flex"}
              `}
            >
              <button
                type="button"
                onClick={() => setIsGenreOpen((prev) => !prev)}
                className="
                  flex
                  h-9
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-[#E4E4E7]
                  bg-[var(--background)]
                  px-2.5
                  text-[var(--foreground)]
                  md:px-4
                "
              >
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`
                    transition-transform
                    duration-200
                    ${isGenreOpen ? "rotate-180" : ""}
                  `}
                />

                <span className="hidden md:inline">Genre</span>
              </button>

              {/* GENRE DROPDOWN */}

              {isGenreOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    z-[9999]
                    mt-2
                    w-[320px]
                    max-w-[calc(100vw-32px)]
                    rounded-lg
                    border
                    border-[#E4E4E7]
                    bg-[var(--background)]
                    p-5
                    text-[var(--foreground)]
                    shadow-xl

                    md:left-1/2
                    md:w-[577px]
                    md:-translate-x-1/2
                  "
                >
                  <h3 className="text-lg font-semibold">Genres</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    See lists of movies by genre
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
                    {genres.map((genre) => (
                      <button
                        type="button"
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
                          border-[var(--foreground)]
                          px-2.5
                          py-0.5
                          text-xs
                          font-bold
                          text-[var(--foreground)]
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
            </div>

            {/* ========================= */}
            {/* SEARCH */}
            {/* ========================= */}

            <div
              ref={searchRef}
              className={`
                relative

                ${isMobileSearchOpen ? "flex min-w-0 flex-1" : "hidden md:flex"}

                md:w-94.75
              `}
            >
              <div className="relative flex w-full">
                <Search
                  size={16}
                  strokeWidth={2}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[var(--foreground)]
                  "
                />

                <input
                  ref={inputRef}
                  autoFocus={isMobileSearchOpen}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search..."
                  className={`
                    h-9
                    w-full
                    rounded-lg
                    border
                    bg-[var(--background)]
                    pl-10
                    pr-9
                    text-sm
                    text-[var(--foreground)]
                    outline-none
                    placeholder:text-gray-500

                    ${
                      isSearchFocused
                        ? "border-[#6C5CE7] ring-1 ring-[#6C5CE7]"
                        : "border-[#E4E4E7]"
                    }
                  `}
                />

                {/* ========================= */}
                {/* CLOSE MOBILE SEARCH */}
                {/* ========================= */}

                {isMobileSearchOpen && (
                  <button
                    type="button"
                    onClick={handleCloseMobileSearch}
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      -translate-y-1/2
                      items-center
                      justify-center
                      text-gray-500
                      md:hidden
                    "
                  >
                    <X size={16} />
                  </button>
                )}

                {/* ================================================= */}
                {/* RECENT SEARCHES */}
                {/* ================================================= */}

                {showRecentSearches && (
                  <div
                    className="
                      absolute
                      left-0
                      top-11
                      z-[10000]
                      w-full
                      overflow-hidden
                      rounded-lg
                      border
                      border-[#E4E4E7]
                      bg-[var(--background)]
                      text-[var(--foreground)]
                      shadow-lg
                    "
                  >
                    {/* HEADER */}

                    <div className="flex items-center justify-between px-[14px] py-3">
                      <span className="text-sm font-semibold">
                        Recent searches
                      </span>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={clearSearches}
                        className="
                          text-xs
                          font-medium
                          text-[#9A9AA6]
                          transition
                          hover:text-[#6C5CE7]
                        "
                      >
                        Clear all
                      </button>
                    </div>

                    {/* ROWS */}

                    {searches.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleHistoryClick(item)}
                        className={`
                          flex
                          h-9
                          cursor-pointer
                          items-center
                          justify-between
                          px-[14px]
                          transition-colors

                          ${
                            highlightedIndex === index
                              ? "bg-gray-100 dark:bg-white/10"
                              : "hover:bg-gray-100 dark:hover:bg-white/10"
                          }
                        `}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Clock
                            size={16}
                            strokeWidth={2}
                            className="shrink-0 text-[#9A9AA6]"
                          />

                          <span className="truncate text-sm">{item}</span>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearch(item);
                          }}
                          className="
                            ml-3
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded
                            text-[#9A9AA6]
                            transition
                            hover:bg-gray-200
                            hover:text-[#EF4444]
                            dark:hover:bg-white/10
                          "
                          aria-label={`Remove ${item}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================================================= */}
                {/* LIVE SEARCH RESULTS */}
                {/* ================================================= */}

                {showSearchResults && (
                  <div
                    className="
                      absolute
                      left-0
                      top-11
                      z-[10000]
                      w-full
                      overflow-hidden
                      rounded-lg
                      border
                      border-[#E4E4E7]
                      bg-[var(--background)]
                      text-[var(--foreground)]
                      shadow-lg
                    "
                  >
                    {isSearching ? (
                      <div className="p-3 text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((movie, index) => (
                        <button
                          type="button"
                          key={movie.id}
                          onClick={() => handleMovieClick(movie)}
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            p-2
                            text-left
                            transition

                            ${
                              highlightedIndex === index
                                ? "bg-gray-100 dark:bg-white/10"
                                : "hover:bg-gray-100 dark:hover:bg-white/10"
                            }
                          `}
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "/placeholder.png"
                            }
                            alt={movie.title}
                            className="
                              h-12
                              w-8
                              shrink-0
                              rounded
                              object-cover
                            "
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {movie.title}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>
                                ★{" "}
                                {movie.vote_average
                                  ? movie.vote_average.toFixed(1)
                                  : "N/A"}
                              </span>

                              <span>
                                {movie.release_date
                                  ? movie.release_date.slice(0, 4)
                                  : "Unknown"}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        No movies found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ========================= */}
            {/* WATCHLIST */}
            {/* ========================= */}

            <button
              type="button"
              onClick={() => router.push("/watchlist")}
              className={`
                relative
                h-9
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-[#E4E4E7]
                bg-[var(--background)]
                px-3
                text-[var(--foreground)]
                transition
                hover:border-red-500
                hover:text-red-500

                ${isMobileSearchOpen ? "hidden" : "flex"}

                md:flex
              `}
              title="Watchlist"
            >
              <Heart size={14} strokeWidth={2} />

              <span className="hidden text-sm font-medium md:inline">
                Watchlist
              </span>

              {watchlistCount > 0 && (
                <span
                  className="
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          {/* ========================= */}
          {/* THEME */}
          {/* ========================= */}

          <button
            type="button"
            onClick={handleThemeToggle}
            className={`
              flex
              h-9
              w-10
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-md
              border
              border-[#E4E4E7]
              bg-[var(--background)]
              text-[var(--foreground)]

              ${isMobileSearchOpen ? "hidden" : "flex"}

              md:flex
              md:w-12
            `}
          >
            {isDark ? (
              <Sun size={16} strokeWidth={2} />
            ) : (
              <Moon size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
