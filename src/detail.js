import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import './detail.css';
import MovieComment from "./components/MovieComment";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [writers, setWriters] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const apiKey = process.env.REACT_APP_APIKEY;
  const baseURL = process.env.REACT_APP_BASEURL;
  const baseImg = process.env.REACT_APP_BASEIMGURL;
  const profileImg = process.env.REACT_APP_BASEPROFILEIMGURL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`${baseURL}/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos,images`);
        setMovie(movieRes.data);

        const crew = movieRes.data.credits.crew;
        const directors = crew.filter(person => person.job === 'Director');
        setDirector(directors.length > 0 ? directors[0].name : 'N/A');

        const writersList = crew.filter(person => person.department === 'Writing');
        setWriters(writersList.slice(0, 2));
        setCast(movieRes.data.credits.cast.slice(0, 15));

        const videos = movieRes.data.videos.results;
        const youtubeTrailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
        setTrailer(youtubeTrailer);

        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(savedFavorites.some(item => item.id === movieRes.data.id));

        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setIsInWatchlist(savedWatchlist.some(item => item.id === movieRes.data.id));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchData();
  }, [id, apiKey, baseURL]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlayTrailer = () => {
    if (trailer && trailer.key) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    } else {
      alert('Trailer not available.');
    }
  };

  const handleAddToFavorites = () => {
    if (!movie) return;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.find(item => item.id === movie.id);

    if (!exists) {
      const updatedFavorites = [...favorites, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      }];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      alert(`${movie.title} added to your favorites!`);
    } else {
      const updatedFavorites = favorites.filter(item => item.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      alert(`${movie.title} removed from your favorites.`);
    }
  };

  const handleToggleWatchlist = () => {
    if (!movie) return;
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const exists = watchlist.find(item => item.id === movie.id);

    let updatedWatchlist;
    if (exists) {
      updatedWatchlist = watchlist.filter(item => item.id !== movie.id);
      setIsInWatchlist(false);
      alert(`${movie.title} removed from your watchlist.`);
    } else {
      updatedWatchlist = [...watchlist, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      }];
      setIsInWatchlist(true);
      alert(`${movie.title} added to your watchlist!`);
    }

    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  if (!movie) {
    return <p style={{ color: "white", padding: 40, textAlign: 'center' }}>Loading movie details...</p>;
  }

  return (
    <div className="imdb-page-wrapper">
      <div className="imdb-main-content">
        <div className="imdb-content-left">
          <div className="imdb-poster-trailer-section">
            <img
              src={movie.poster_path ? `${baseImg}/${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.title}
              className="imdb-poster"
            />
            <div className="imdb-trailer-overlay">
              <button className="imdb-play-button" onClick={handlePlayTrailer}>
                <i className="fas fa-play"></i> Play trailer
              </button>
            </div>
          </div>

          <div className="imdb-info-section">
            <h1 className="imdb-title">
              {movie.title} <span className="imdb-year">({movie.release_date?.substring(0, 4) || 'N/A'})</span>
            </h1>

            <div className="imdb-subinfo">
              {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
              <span className="imdb-release-date">{movie.release_date || 'N/A'} (USA)</span>
            </div>

            <div className="imdb-genres">
              {movie.genres?.length > 0 ? (
                movie.genres.map((genre) => (
                  <span key={genre.id} className="imdb-tag">{genre.name}</span>
                ))
              ) : (
                <span className="imdb-tag">N/A Genres</span>
              )}
            </div>

            {movie.tagline && <p className="imdb-tagline">"{movie.tagline}"</p>}
            <p className="imdb-overview">{movie.overview || 'No overview available.'}</p>

            {trailer && (
              <div className="imdb-trailer-embed-section">
                <h3 className="trailer-title">Official Trailer</h3>
                <iframe
                  width="100%"
                  height="auto"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Official Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {cast.length > 0 && (
              <div className="imdb-top-cast-section">
                <div className="imdb-section-header">
                  <h2>Top cast</h2>
                </div>
                <div className="imdb-cast-grid">
                  {cast.map(actor => (
                    <div key={actor.id} className="imdb-cast-item">
                      <div className="imdb-cast-photo-wrapper">
                        <img
                          src={actor.profile_path ? `${profileImg}${actor.profile_path}` : "https://via.placeholder.com/45x45?text=No+Photo"}
                          alt={actor.name}
                          className="imdb-cast-photo"
                        />
                      </div>
                      <div className="imdb-cast-details">
                        <span className="imdb-cast-name">{actor.name}</span>
                        <span className="imdb-cast-character">{actor.character || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="imdb-cast-crew-summary">
                  {director && <p><strong>Director:</strong> <a href="#">{director}</a></p>}
                  {writers.length > 0 && (
                    <p><strong>Writers:</strong> {writers.map((writer, index) => (
                      <span key={writer.id}>
                        <a href="#">{writer.name}</a>{index < writers.length - 1 ? ", " : ""}
                      </span>
                    ))}</p>
                  )}
                </div>
              </div>
            )}

            <div className="imdb-additional-details">
              <h3>Details</h3>
              <p><strong>Budget:</strong> {formatCurrency(movie.budget)}</p>
              <p><strong>Revenue:</strong> {formatCurrency(movie.revenue)}</p>
              <p><strong>Popularity:</strong> {movie.popularity?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="imdb-sidebar">
          <div className="imdb-rating-section">
            <h3>IMDb RATING</h3>
            <div className="imdb-rating-value">
              <i className="fas fa-star"></i>
              <div>
                <strong>{movie.vote_average?.toFixed(1) || 'N/A'}</strong>/10
                <span className="imdb-rating-count">{movie.vote_count ? `${(movie.vote_count / 1000000).toFixed(1)}M` : 'N/A'}</span>
              </div>
            </div>
            <button className="imdb-rate-button">
              <i className="fas fa-star"></i> Rate
            </button>
          </div>

          <div className="imdb-favorite-section">
            <button
              className={`imdb-favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={handleAddToFavorites}
            >
              <i className="fas fa-heart"></i>
              {isFavorite ? " Favorited" : " Add to Favorite"}
            </button>
          </div>

          <div className="imdb-watchlist-section">
            <button
              className={`imdb-watchlist-button ${isInWatchlist ? 'watchlisted' : ''}`}
              onClick={handleToggleWatchlist}
            >
              <i className={`fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}`}></i>
              {isInWatchlist ? " Remove from Watchlist" : " Add to Watchlist"}
            </button>
            <p className="imdb-added-count">
              <i className="fas fa-users"></i> Saved locally
            </p>
          </div>

          <div className="imdb-media-links">
            <div className="imdb-media-item">
              <i className="fas fa-video"></i> {movie.videos?.results?.length > 0 ? `${movie.videos.results.length} VIDEOS` : 'NO VIDEOS'}
            </div>
            <div className="imdb-media-item">
              <i className="fas fa-image"></i> {movie.images?.posters?.length > 0 ? `${movie.images.posters.length}+ PHOTOS` : 'NO PHOTOS'}
            </div>
          </div>
        </div>
      </div>

      <div className="imdb-comment-wrapper">
        <MovieComment movieId={id} />
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};

export default Detail;
