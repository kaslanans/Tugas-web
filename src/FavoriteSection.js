// src/components/FavoriteSection.js
import { useEffect, useState } from 'react';

const FavoriteSection = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const favs = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(favs);
    };

    loadFavorites();

    window.addEventListener("storage", loadFavorites);
    window.addEventListener("focus", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
      window.removeEventListener("focus", loadFavorites);
    };
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {favorites.map(movie => (
            <div key={movie.id} style={{ width: '150px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteSection;
