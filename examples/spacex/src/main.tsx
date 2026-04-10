import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { VariantProvider } from "react-variant-switcher";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VariantProvider syncWithUrl>
      <App />
    </VariantProvider>
  </StrictMode>
);
