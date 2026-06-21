import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Movie, TmdbResponse } from "../types/movie";

const BASE_URL = "https://themoviedb.org";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default async function fetchMovies(): Promise<Movie[]> {
  const config = {
    params: {
      language: "uk-UA",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };
  const response: AxiosResponse<TmdbResponse> = await axios.get(
    `${BASE_URL}/trending/movie/day`,
    config,
  );
  return response.data.results;
}
