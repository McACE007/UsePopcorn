import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import StarRating from "./StarRating";

import { useKey } from "../hooks/useKey";

const APIKey = import.meta.env.VITE_AP_API_KEY;
const APIUrl = `http://www.omdbapi.com/?apikey=${APIKey}`;

export default function MovieDetails({
  selectedId,
  onCloseMovieDetails,
  onAddWatchMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId,
  )?.userRating;

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      try {
        setError("");
        const response = await fetch(`${APIUrl}&i=${selectedId}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error("Something went wrong while fetching the movies");
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => (document.title = "usePopcorn");
  }, [title]);

  useKey("Escape", onCloseMovieDetails);

  function handleAdd() {
    const newMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: runtime.split(" ").at(0),
    };
    onAddWatchMovie(newMovie);
    onCloseMovieDetails();
  }

  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                defaultRating={watchedUserRating}
                onSetRating={setUserRating}
              />
              {userRating && (
                <button className="btn-add" onClick={handleAdd}>
                  Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
