"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Header } from "@/app/features/Header";
import { Footer } from "@/app/features/Footer";
import { MovieSection } from "@/app/components/Moviesection";
import { MovieSectionSkeleton } from "@/app/components/Moviesectionskeleton";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

export default function SimiliarPage() {
  const { id } = useParams();

  const [similarData, setSimilarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getData = async (page) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    console.log("PAGE:", page);
    console.log("STATUS:", response.status);
    console.log("API DATA:", jsonData);

    if (!response.ok) {
      throw new Error(jsonData.status_message || "MOVIE API ERROR");
    }

    return jsonData;
  };
  useEffect(() => {
    if (!id) return;

    getData(currentPage)
      .then((data) => {
        setSimilarData(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((error) => {
        console.error("SIMILAR MOVIE ERROR:", error);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full px-20 py-10">
          <div className="mx-auto max-w-7xl">
            {/* LOADING */}
            {loading ? (
              <>
                <MovieSectionSkeleton />

                <div className="mt-8 flex items-center justify-end gap-2">
                  <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />

                  <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />

                  <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200" />
                </div>
              </>
            ) : errorMessage ? (
              /* ERROR */
              <div className="py-10 text-center text-red-500">
                {errorMessage}
              </div>
            ) : (
              /* DATA */
              <>
                <MovieSection
                  title="More Like This"
                  movies={similarData.slice(0, 10)}
                  isDetailPage={true}
                />

                <div className="mt-8 flex items-center justify-end gap-2">
                  {/* PREVIOUS */}
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-md border px-3 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft />
                    Previous
                  </button>

                  {/* PAGE NUMBERS */}
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
                        className={`min-w-10 rounded-md border px-3 py-2 transition ${
                          currentPage === page
                            ? "border-black bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* NEXT */}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-md border px-3 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight />
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
