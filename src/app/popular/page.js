"use client";

import { Header } from "../features/Header";
import { Footer } from "../features/Footer";
import { MovieSection } from "../components/Moviesection";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MovieSkeletonGrid } from "../components/MovieSkeletonGrid";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

export default function PopularPage() {
  const [popularData, setPopularData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getData = async (type, page) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData.results;
  };

  useEffect(() => {
    setLoading(true);

    getData("popular", currentPage)
      .then((popular) => {
        setPopularData(popular);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < 57) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (currentPage <= 5) {
      pages.push(1, 2, 3, 4, 5, "...", 57);
    } else if (currentPage >= 53) {
      pages.push(1, "...", 53, 54, 55, 56, 57);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "...",
        57,
      );
    }

    return pages;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {" "}
      <Header />
      <main className="flex-1">
        {/* SAME RESPONSIVE LAYOUT */}
        <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-20 lg:py-10">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <>
                <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200" />

                <MovieSkeletonGrid />
              </>
            ) : errorMessage ? (
              <div className="py-10 text-center text-red-500">
                {errorMessage}
              </div>
            ) : (
              <>
                <MovieSection
                  title="POPULAR"
                  movies={popularData.slice(0, 10)}
                  path="/popular"
                  isDetailPage={true}
                />

                {/* PAGINATION */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="px-1 py-2 text-gray-500 sm:px-2"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-9 rounded-md border px-2 py-2 text-sm transition sm:min-w-10 sm:px-3 ${
                          currentPage === page
                            ? "border-black bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={handleNext}
                    disabled={currentPage === 57}
                    className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
