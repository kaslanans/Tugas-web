import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: "#111", padding: "10px" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px", margin: 0 }}>
        <li><Link style={{ color: "white" }} to="/">Home</Link></li>
        <li><Link style={{ color: "white" }} to="/top-rated">Top Rated</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
