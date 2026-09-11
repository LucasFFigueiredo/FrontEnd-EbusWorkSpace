import { Loader2 } from "lucide-react";
import "./appstyle.css";

export default function Loading() {
  return (
    <div className="app-loading-container">
      <Loader2 className="app-loading-icon" />
      <p className="app-loading-text">Carregando dados no servidor...</p>
    </div>
  );
}
