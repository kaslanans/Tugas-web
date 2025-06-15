import { useEffect, useState } from "react";
import './MovieComment.css';

const MovieComment = ({ movieId }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("movieComments")) || {};
    if (data[movieId]) {
      setComments(data[movieId].comments || []);
    }
  }, [movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !comment || rating === null || rating === "") {
      alert("Harap isi semua kolom.");
      return;
    }

    const newComment = {
      name,
      comment,
      rating: parseFloat(rating),
      date: new Date().toISOString().split("T")[0]
    };

    const data = JSON.parse(localStorage.getItem("movieComments")) || {};
    const existing = data[movieId]?.comments || [];
    const updatedComments = [...existing, newComment];

    data[movieId] = { comments: updatedComments };
    localStorage.setItem("movieComments", JSON.stringify(data));
    setComments(updatedComments);

    // Reset form
    setName("");
    setComment("");
    setRating(0);
  };

  return (
    <div className="movie-comment-section">
      <h2>Comments & Ratings</h2>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          max="5"
          min="0"
          step="0.1"
        />
        <button type="submit">Submit</button>
      </form>

      <div className="comment-list">
        {comments.map((c, index) => (
          <div className="comment-item" key={index}>
            <div className="comment-text">{c.comment}</div>
            <div>
              <span className="comment-author">{c.name}</span>{" "}
              <span className="comment-rating">({c.rating}⭐) - {c.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieComment;
