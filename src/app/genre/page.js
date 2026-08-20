"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Header } from "../features/Header";
import { Footer } from "../features/Footer";

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

export default function Genre() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-4">
        <h2 className="text-3xl font-semibold">Search Filter</h2>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="mb-2 text-lg font-semibold">Genres</h3>

          <p className="mb-4 text-xs text-gray-500">
            See lists of movies by genre
          </p>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => router.push(`/genre/${genre.id}`)}
                className="flex w-fit items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <span>{genre.name}</span>

                <ChevronRight size={12} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
