import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie, TmdbResponse } from "../../types/movie";
import type { AxiosResponse } from "axios";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchSubmit = (newQuery: string) => {
    setMovies([]);
    setQuery(newQuery);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!query) return;

    const getMovies = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
        const BASE_URL = "https://themoviedb.org";

        const response: AxiosResponse<TmdbResponse> = await axios.get(
          `${BASE_URL}/search/movie`,
          {
            params: { query, language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
          },
        );

        const fetchedMovies = response.data.results;

        if (fetchedMovies.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }

        setMovies(fetchedMovies);
      } catch (error) {
        setIsError(true);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [query]);

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />

      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isError && !isLoading && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
