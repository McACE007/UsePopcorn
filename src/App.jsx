import { useState } from "react";
import "./App.css";

import ErrorMessage from "./components/ErrorMessage";
import ListBox from "./components/ListBox";
import Loader from "./components/Loader";
import Logo from "./components/Logo";
import MovieDetails from "./components/MovieDetails";
import MoviesList from "./components/MoviesList";
import NavBar from "./components/NavBar";
import NumResults from "./components/NumResults";
import Search from "./components/Search";
import WatchedMoviesList from "./components/WatchedMoviesList";
import WatchedMoviesSummary from "./components/WatchedMoviesSummary";

import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useMovies } from "./hooks/useMovies";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, error, isLoading } = useMovies(
    query,
    handleCloseMovieDetails,
  );

  const [watched, setWatched] = useLocalStorageState([], "WatchedMovies");

  function handleSelectMovie(id) {
    setSelectedId((curID) => (curID === id ? null : id));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => {
      const filteredWatched = watched.filter(
        (watchMovie) => watchMovie.imdbId !== movie.imdbId,
      );
      return [...filteredWatched, movie];
    });
  }

  function handleRemoveWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <ListBox>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </ListBox>

        <ListBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovieDetails={handleCloseMovieDetails}
              onAddWatchMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedMoviesSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
