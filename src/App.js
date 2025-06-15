import './App.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [isTopRated, setIsTopRated] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = process.env.REACT_APP_APIKEY;
  const BASE_URL = process.env.REACT_APP_BASEURL;
  const BASE_IMG = process.env.REACT_APP_BASEIMGURL;

  const getPopularMovies = async () => {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    setMovies(response.data.results);
    setAllMovies(response.data.results);
    setIsTopRated(false);
  };

  const getTopRatedMovies = async () => {
    const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    setMovies(response.data.results);
    setAllMovies(response.data.results);
    setIsTopRated(true);
  };

  useEffect(() => {
    getPopularMovies();
  }, []);

  const search = async (q) => {
    if (q.length > 2) {
      const response = await axios.get(`${BASE_URL}/search/movie?query=${q}&api_key=${API_KEY}`);
      setMovies(response.data.results);
    } else {
      isTopRated ? getTopRatedMovies() : getPopularMovies();
    }
  };

  const toggleFavorite = (movieObj) => {
    const isExist = favorites.some(item => item.id === movieObj.id);
    let updatedFavorites;

    if (isExist) {
      updatedFavorites = favorites.filter(item => item.id !== movieObj.id);
    } else {
      updatedFavorites = [...favorites, {
        id: movieObj.id,
        title: movieObj.title,
        poster_path: movieObj.poster_path
      }];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleWatchlist = (movieObj) => {
    const isExist = watchlist.some(item => item.id === movieObj.id);
    let updatedWatchlist;

    if (isExist) {
      updatedWatchlist = watchlist.filter(item => item.id !== movieObj.id);
    } else {
      updatedWatchlist = [...watchlist, {
        id: movieObj.id,
        title: movieObj.title,
        poster_path: movieObj.poster_path
      }];
    }

    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  const showFavorites = () => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setMovies(stored);
    setIsTopRated(false);
  };

  const showWatchlist = () => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setMovies(stored);
    setIsTopRated(false);
  };

  const isFavorite = (movieId) => favorites.some(item => item.id === movieId);
  const isInWatchlist = (movieId) => watchlist.some(item => item.id === movieId);

  return (
    <div className="App">
      <header className="navigation">
        <div className="logo">Moview<span>™</span></div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="nav-icon"></span>
        </label>
        <ul className="menu">
          <li><button onClick={getPopularMovies} className="nav-btn">Home</button></li>
          <li><button onClick={getPopularMovies} className="nav-btn">Popular</button></li>
          <li><button onClick={getTopRatedMovies} className="nav-btn">Top Rated</button></li>
          <li><button onClick={showFavorites} className="nav-btn">Favorite</button></li>
          <li><button onClick={showWatchlist} className="nav-btn">Watchlist</button></li>
        </ul>
      </header>

      <input
        placeholder="Search movies..."
        className="movie-search"
        onChange={({ target }) => search(target.value)}
      />

      <div className="movie-container" id={isTopRated ? "toprated" : "popular"}>
        {movies.map((movie, i) => (
          <Link
  to={`/detail/${movie.id}`}
  className="movie-wrapper"
  key={i}
  style={{ textDecoration: "none" }}
>
  <div className="movie-title">{movie.title}</div>

  <div className="button-group">
    <button
      className="fav-btn"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(movie);
      }}
    >
      {isFavorite(movie.id) ? "❤️" : "🤍"}
    </button>

    <button
      className="fav-btn"
      onClick={(e) => {
        e.preventDefault();
        toggleWatchlist(movie);
      }}
    >
      {isInWatchlist(movie.id) ? "🕒" : "➕"}
    </button>
  </div>

  <img
    className="movie-image"
    src={
      movie.poster_path
        ? `${BASE_IMG}/${movie.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image"
    }
    alt={movie.title}
  />
  <div className="movie-date">{movie.release_date}</div>
  <div className="movie-rate">⭐ {movie.vote_average}</div>
</Link>

        ))}
      </div>
    </div>
  );
};

export default App;
