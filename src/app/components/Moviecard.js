"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const MovieCard = ({ image, title, rating, movie }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkWatchlist = () => {
      try {
        const saved = localStorage.getItem("moviez:watchlist");

        if (!saved) {
          setIsSaved(false);
          return;
        }

        const list = JSON.parse(saved);

        setIsSaved(
          Array.isArray(list) && list.some((item) => item.id === movie.id),
        );
      } catch {
        setIsSaved(false);
      }
    };

    checkWatchlist();

    window.addEventListener("watchlistChanged", checkWatchlist);

    return () => {
      window.removeEventListener("watchlistChanged", checkWatchlist);
    };
  }, [movie.id]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let list = [];

    try {
      const saved = localStorage.getItem("moviez:watchlist");
      list = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(list)) {
        list = [];
      }
    } catch {
      list = [];
    }

    const exists = list.some((item) => item.id === movie.id);

    if (exists) {
      // Remove
      list = list.filter((item) => item.id !== movie.id);

      setIsSaved(false);
    } else {
      // Add
      list = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          addedAt: Date.now(),
        },
        ...list,
      ];

      setIsSaved(true);
    }

    try {
      localStorage.setItem("moviez:watchlist", JSON.stringify(list));
    } catch {}

    window.dispatchEvent(new Event("watchlistChanged"));
  };

  return (
    <div className="relative w-full">
      <img
        src={image}
        alt={title}
        className="w-full aspect-[229.73/340] object-cover rounded-lg"
      />

      <button
        onClick={handleHeartClick}
        className={`absolute right-2 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full transition-transform hover:scale-110 ${
          isSaved
            ? "bg-[#F43F5E] text-white"
            : "border border-white/15 bg-black/60 text-white"
        }`}
      >
        <Heart
          size={14}
          fill={isSaved ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      <div className="mt-2">
        <p className="text-sm text-gray-500">⭐ {rating}/10</p>

        <h3 className="font-medium">{title}</h3>
      </div>
    </div>
  );
};
