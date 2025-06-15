import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopRated = () => {
  const [topRated, setTopRated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("movieComments")) || {};

    // Hitung rata-rata rating per film
    const ratedMovies = Object.entries(data).map(([movieId, entry]) => {
      const comments = entry.comments || [];
      const totalRating = comments.reduce((sum, c) => sum + c.rating, 0);
      const avgRating = comments.length > 0 ? totalRating / comments.length : 0;
      return {
        movieId,
        avgRating: avgRating.toFixed(1),
        commentCount: comments.length,
      };
    });

    // Urutkan berdasarkan rata-rata rating tertinggi
    const sorted = ratedMovies
      .filter((m) => m.commentCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 10); // ambil 10 besar

    setTopRated(sorted);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#ffcc00", textAlign: "center" }}>Top Rated Movies</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {topRated.map((movie, index) => (
          <li
            key={movie.movieId}
            style={{
              background: "#2b2b2b",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "10px",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/detail/${movie.movieId}`)}
          >
            <strong>Movie ID: {movie.movieId}</strong><br />
            Avg Rating: {movie.avgRating} ⭐ ({movie.commentCount} votes)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRated;
