// Home.js
import { useEffect, useState } from "react";
import { getMovieList, searchMovie } from "./api";
import { Link } from "react-router-dom";
import Highlight from "../components/Highlight"; // ✅ Import komponen Highlight

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    getMovieList().then(setPopularMovies);
  }, []);

  const search = async (q) => {
    if (q.length > 2) {
      const query = await searchMovie(q);
      setPopularMovies(query.results);
    } else {
      const result = await getMovieList();
      setPopularMovies(result);
    }
  };

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => (
      <Link to={`/movie/${movie.id}`} key={i} style={{ textDecoration: "none" }}>
        <div className="movie-wrapper" style={{ cursor: "pointer" }}>
          <div className="movie-title">{movie.title}</div>
          <img
            className="movie-image"
            src={
              movie.poster_path
                ? `${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
          />
          <div className="movie-date">{movie.release_date}</div>
          <div className="movie-rate">⭐ {movie.vote_average}</div>
        </div>
      </Link>
    ));
  };

  return (
    <div className="App">
      {/* ✅ NAVIGATION */}
      <header className="navigation">
        <div className="logo">Moview<span>™</span></div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="nav-icon"></span>
        </label>
        <ul className="menu">
          <li><a href="#">Home</a></li>
          <li><a href="#popular">Popular</a></li>
          <li><a href="#toprated">Top Rated</a></li>
          <li><a href="#upcoming">Upcoming</a></li>
          <li><a href="#watchlist">Watchlist</a></li>
          <li><a href="#login">Login</a></li>
        </ul>
      </header>

      {/* ✅ HIGHLIGHT FILM */}
      <Highlight />

      {/* ✅ SEARCH */}
      <input
        placeholder="Search movies..."
        className="movie-search"
        onChange={({ target }) => search(target.value)}
      />

      {/* ✅ MOVIE LIST */}
      <div className="movie-container" id="popular">
        <PopularMovieList />
      </div>
    </div>
  );
};

export default Home;
