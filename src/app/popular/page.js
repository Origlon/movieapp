"use client";
import { Header } from "../features/Header";
import { Footer } from "../features/Footer";
import { MovieSection } from "../components/Moviesection";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MovieSectionSkeleton } from "../components/Moviesectionskeleton";

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
    <div>
      {loading && (
        <div>
          <Header />

          <section className="w-full px-20 py-10">
            <div className="mx-auto max-w-7xl">
              <MovieSectionSkeleton />

              <div className="mt-8 flex items-center justify-end gap-2">
                <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />

                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />

                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />

                <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
      {!loading && errorMessage && <div>{errorMessage}</div>}
      {!loading && !errorMessage && (
        <div>
          <Header />
          <section className="w-full px-20 py-10">
            <div className="mx-auto max-w-7xl">
              <MovieSection
                title="POPULAR"
                movies={popularData.slice(0, 10)}
                path="/popular"
                isDetailPage={true}
              />

              <div className="flex justify-end items-center gap-2 mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-md border
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition"
                >
                  <ChevronLeft />
                  Previous
                </button>

                {getPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-2 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-10 px-3 py-2 rounded-md border transition ${
                        currentPage === page
                          ? "bg-black text-white border-black"
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
                  className="flex items-center gap-1 px-3 py-2 rounded-md border
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition"
                >
                  Next
                  <ChevronRight />
                </button>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
    </div>
  );
}
