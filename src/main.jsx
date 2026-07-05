import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { initializeSeedData, KEYS } from "./utils/localStorage.js";
import { cars, promotions, customers } from "./data/mockData.js";

initializeSeedData({
  [KEYS.cars]: cars,
  [KEYS.promotions]: promotions,
  [KEYS.customers]: customers,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
