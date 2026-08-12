import { Header } from "./features/header";
import { Hero } from "./features/Hero";
import { Footer } from "./features/Footer";
import { MovieSection } from "./components/Moviesection";
import { upcomingMovies, popularMovies, topRatedMovies } from "./data/movies";
export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <section className="w-full px-20 py-10">
        <div className="mx-auto max-w-7xl">
          <MovieSection title="UPCOMING" movies={upcomingMovies} />

          <MovieSection title="POPULAR" movies={popularMovies} />

          <MovieSection title="TOP RATED" movies={topRatedMovies} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
  