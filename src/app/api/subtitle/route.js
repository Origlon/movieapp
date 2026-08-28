import { NextResponse } from "next/server";

const SUBTITLECAT = "https://subtitlecat.com";

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json(
      {
        success: false,
        error: "movieId is required",
      },
      { status: 400 },
    );
  }

  try {
    // =====================================================
    // 1. GET MOVIE
    // =====================================================

    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
          accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!tmdbResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "TMDB request failed",
        },
        {
          status: tmdbResponse.status,
        },
      );
    }

    const movie = await tmdbResponse.json();

    const title = movie.title || movie.original_title || "";
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

    const searchQuery = `${title} ${year}`;

    // =====================================================
    // 2. SEARCH SUBTITLECAT
    // =====================================================

    const searchUrl =
      `${SUBTITLECAT}/index.php?search=` + encodeURIComponent(searchQuery);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: `${SUBTITLECAT}/`,
      },
      cache: "no-store",
    });

    if (!searchResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "SubtitleCat search failed",
        },
        {
          status: searchResponse.status,
        },
      );
    }

    const searchHtml = await searchResponse.text();

    // =====================================================
    // 3. FIND SUBTITLE PAGES
    // =====================================================

    const subtitlePages = [];

    const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;

    let match;

    while ((match = hrefRegex.exec(searchHtml)) !== null) {
      let href = match[1];

      href = href.replace(/&amp;/g, "&");

      if (!href.toLowerCase().includes("subs/")) {
        continue;
      }

      if (!href.toLowerCase().includes(".html")) {
        continue;
      }

      let fullUrl;

      if (href.startsWith("http://") || href.startsWith("https://")) {
        fullUrl = href;
      } else if (href.startsWith("/")) {
        fullUrl = `${SUBTITLECAT}${href}`;
      } else {
        fullUrl = `${SUBTITLECAT}/${href}`;
      }

      if (!subtitlePages.includes(fullUrl)) {
        subtitlePages.push(fullUrl);
      }
    }

    // =====================================================
    // 4. FALLBACK
    // =====================================================

    if (subtitlePages.length === 0) {
      const directRegex = /(?:href=["']?)?((?:\/)?subs\/[^"'<>\\s]+\.html)/gi;

      let directMatch;

      while ((directMatch = directRegex.exec(searchHtml)) !== null) {
        let href = directMatch[1];

        href = href.replace(/&amp;/g, "&");

        let fullUrl;

        if (href.startsWith("http")) {
          fullUrl = href;
        } else if (href.startsWith("/")) {
          fullUrl = `${SUBTITLECAT}${href}`;
        } else {
          fullUrl = `${SUBTITLECAT}/${href}`;
        }

        if (!subtitlePages.includes(fullUrl)) {
          subtitlePages.push(fullUrl);
        }
      }
    }

    console.log("🎬 MOVIE:", title);
    console.log("📅 YEAR:", year);
    console.log("🔎 SEARCH:", searchQuery);
    console.log("📄 SUBTITLE PAGES:", subtitlePages.length);

    // =====================================================
    // 5. CHECK SUBTITLE PAGES
    // =====================================================

    for (const subtitlePage of subtitlePages) {
      try {
        const subtitleResponse = await fetch(subtitlePage, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: searchUrl,
          },
          cache: "no-store",
        });

        if (!subtitleResponse.ok) {
          continue;
        }

        const html = await subtitleResponse.text();

        // =================================================
        // 6. FIND SRT
        // =================================================

        const srtLinks = [];

        const srtRegex = /href\s*=\s*["']([^"']+\.srt[^"']*)["']/gi;

        let srtMatch;

        while ((srtMatch = srtRegex.exec(html)) !== null) {
          let href = srtMatch[1];

          href = href.replace(/&amp;/g, "&");

          let fullUrl;

          if (href.startsWith("http://") || href.startsWith("https://")) {
            fullUrl = href;
          } else if (href.startsWith("/")) {
            fullUrl = `${SUBTITLECAT}${href}`;
          } else {
            fullUrl = `${SUBTITLECAT}/${href}`;
          }

          if (!srtLinks.includes(fullUrl)) {
            srtLinks.push(fullUrl);
          }
        }

        // =================================================
        // 7. FIND MONGOLIAN
        // =================================================

        const mongolianSrt = srtLinks.find((url) => {
          const decodedUrl = decodeURIComponent(url).toLowerCase();

          return (
            decodedUrl.includes("-mn.srt") ||
            decodedUrl.includes("_mn.srt") ||
            decodedUrl.includes("(mn).srt")
          );
        });

        if (!mongolianSrt) {
          continue;
        }

        console.log("🇲🇳 MONGOLIAN SRT FOUND:");
        console.log(mongolianSrt);

        // =================================================
        // 8. DOWNLOAD SRT
        // =================================================

        const srtResponse = await fetch(mongolianSrt, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
            Accept: "*/*",
            Referer: subtitlePage,
          },
          cache: "no-store",
        });

        if (!srtResponse.ok) {
          continue;
        }

        const srt = await srtResponse.text();

        if (!srt.trim()) {
          continue;
        }

        // =================================================
        // 9. SRT -> VTT
        // =================================================

        const vtt = srtToVtt(srt);

        console.log("✅ VTT READY");
        console.log("📏 VTT LENGTH:", vtt.length);

        // =================================================
        // 10. RETURN VTT
        // =================================================

        return new Response(vtt, {
          status: 200,

          headers: {
            "Content-Type": "text/vtt; charset=utf-8",

            // IMPORTANT:
            // attachment БИШ
            // browser/iframe шууд VTT уншина

            "Content-Disposition": "inline",

            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",

            Pragma: "no-cache",

            Expires: "0",

            "Access-Control-Allow-Origin": "*",

            "Access-Control-Allow-Methods": "GET, OPTIONS",

            "Access-Control-Allow-Headers": "*",
          },
        });
      } catch (error) {
        console.error("❌ SUBTITLE PAGE ERROR:", error);

        continue;
      }
    }

    // =====================================================
    // 11. NOT FOUND
    // =====================================================

    return NextResponse.json({
      success: false,
      movieId,
      movie: title,
      year,
      searchQuery,
      searchUrl,
      subtitlePagesFound: subtitlePages.length,
      message: "Mongolian subtitle not found.",
    });
  } catch (error) {
    console.error("❌ SUBTITLE API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// SRT -> WEBVTT
// =====================================================

function srtToVtt(srt) {
  let text = srt
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  text = text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");

  text = text.replace(/^WEBVTT\s*/i, "");

  return `WEBVTT\n\n${text.trim()}\n`;
}
