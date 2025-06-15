import axios from "axios";

const apiKey = process.env.REACT_APP_APIKEY;
const baseURL = process.env.REACT_APP_BASEURL;

export const getMovieList = async () => {
  try {
    const response = await axios.get(`${baseURL}/movie/popular`, {
      params: { api_key: apiKey }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const searchMovie = async (q) => {
  try {
    const response = await axios.get(`${baseURL}/search/movie`, {
      params: { api_key: apiKey, query: q }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movie:", error);
    return { results: [] };
  }
};

export const getMovieDetail = async (movieId) => {
  const movie = await axios.get(`${baseURL}/movie/${movieId}?api_key=${apiKey}`);
  return movie.data;
};

export const getMovieTrailer = async (movieId) => {
  try {
    const response = await axios.get(`${baseURL}/movie/${movieId}/videos`, {
      params: { api_key: apiKey }
    });

    const trailers = response.data.results;

    const youtubeTrailer = trailers.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    return youtubeTrailer;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    return null;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${baseURL}/movie/top_rated`, {
      params: { api_key: apiKey }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
  
  


};
