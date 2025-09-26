import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppNavbar from "./components/AppNavbar";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-blue-100 to-yellow-100">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
