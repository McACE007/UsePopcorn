import { useEffect, useState } from "react";

const APIKey = import.meta.env.VITE_APP_API_KEY;
const APIUrl = `http://www.omdbapi.com/?apikey=${APIKey}`;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    callback?.();
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${APIUrl}&s=${query}`, {
          signal: controller.signal,
        });

        if (!response.ok)
          throw new Error("Something went wrong while fetching the movies");

        const data = await response.json();

        if (data.Response == "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
