import { createRoot } from "react-dom/client";
import App from "./App";
import { loadPortalData } from "./data/portalData";
import "./index.css";

// O conteúdo vem de /content/portal-data.json, não do bundle. Carregar antes do
// primeiro render evita que as páginas apareçam vazias por um frame — e enquanto
// isso o HTML pré-renderizado continua visível.
loadPortalData()
  .catch((error) => console.error("Falha ao carregar o conteúdo do portal", error))
  .finally(() => createRoot(document.getElementById("root")!).render(<App />));
