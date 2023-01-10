import React from "react";

import { createRoot } from "react-dom/client";

import App from "./App";
const rootElement = document.getElementById("root"); //render is deprecated

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}