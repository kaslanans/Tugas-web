import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Detail from "./detail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopRated from "./components/toprated";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/top-rated" element={<TopRated />} />
    </Routes>
  </Router>
);
