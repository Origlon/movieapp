/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { Header } from "../features/header";
import { Footer } from "../features/Footer";
import { MovieSection } from "../components/Moviesection";
import { MoreLikethis,  } from "../data/movies";

export default function Detail() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <Header />

      <div className="mt-12 mb-8 w-full max-w-6xl px-4">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold leading-10 tracking-tight">
              Wicked
            </h1>

            <p className="mt-1 text-lg font-extralight">
              2024.11.26 · PG · 2h 40m
            </p>
          </div>

          <div>
            <p className="text-xs text-[#09090B]">Rating</p>

            <div className="flex items-center gap-1">
              <div className="flex flex-col">
                <div className="flex items-end">
                  <span className="text-xl text-yellow-400 sm:text-2xl">★</span>

                  <span className="text-lg font-normal">6.9</span>

                  <span className="text-lg text-[#71717A]">/10</span>
                </div>

                <span className="text-xs text-[#71717A]">37k</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="relative h-107.5 w-full shrink-0 overflow-hidden rounded-xl md:w-72">
            <img
              src="/pictures/image7.png"
              alt="Wicked"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative flex h-107.5 w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
            <img
              src="/pictures/image8.jpg"
              alt="Wicked"
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 text-white">
              <button
                onClick={() => setIsPlaying(true)}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 hover:bg-gray-200"
              >
                <Play size={20} fill="currentColor" />
              </button>

              <span
                className="cursor-pointer select-none text-lg font-semibold"
                onClick={() => setIsPlaying(true)}
              >
                Play trailer
              </span>

              <span className="text-sm text-gray-300">2:35</span>
            </div>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-200 sm:p-8">
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute right-4 top-12 z-50 flex cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-white transition-all hover:bg-black"
            >
              ✕ Close
            </button>

            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/6COmYeLsz4c?autoplay=1&rel=0"
              title="Wicked Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div
            className="absolute inset-0 z-[-1]"
            onClick={() => setIsPlaying(false)}
          />
        </div>
      )}

      <div className="mb-8 flex w-full max-w-6xl flex-col gap-5 px-4">
        <div className="flex flex-wrap gap-2">
          {["Fairy Tale", "Pop Musical", "Fantasy", "Musical", "Romance"].map(
            (genre) => (
              <span
                key={genre}
                className="rounded-full border border-[#E4E4E7] bg-white px-3 py-1 text-xs font-medium"
              >
                {genre}
              </span>
            ),
          )}
        </div>

        <div>
          <p className="text-base leading-relaxed text-gray-800">
            Elphaba, a misunderstood young woman because of her green skin, and
            Glinda, a popular girl, become friends at Shiz University in the
            Land of Oz. After an encounter with the Wonderful Wizard of Oz,
            their friendship reaches a crossroads.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
            <p className="w-20 shrink-0 text-base font-bold">Director</p>

            <p className="text-base font-light">Jon M. Chu</p>
          </div>

          <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
            <p className="w-20 shrink-0 text-base font-bold">Writers</p>

            <p className="text-base font-light">
              Winnie Holzman · Dana Fox · Gregory Maguire
            </p>
          </div>

          <div className="flex gap-12 border-b border-[#E4E4E7] pb-3">
            <p className="w-20 shrink-0 text-base font-bold">Stars</p>

            <p className="text-base font-light">
              Cynthia Erivo · Ariana Grande · Jeff Goldblum
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 mb-16">
        <MovieSection title="More Like This" movies={MoreLikethis} />
      </div>

      <Footer />
    </div>
  );
}
