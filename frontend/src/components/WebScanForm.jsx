import React, { useState } from "react";
import { scanWeb } from "../api";

const WebScanForm = ({ onResults }) => {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await scanWeb(target);
      onResults(res.data);
    } catch {
      setError("No se pudo realizar el escaneo web.");
    }
    setLoading(false);
  };

  return (
    <form className="p-3 mb-4 bg-white rounded border shadow-sm" onSubmit={handleSubmit}>
      <div className="row align-items-end">
        <div className="col-md-9">
          <input
            className="form-control"
            placeholder="URL (https://...)"
            value={target}
            onChange={e => setTarget(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3 mt-2 mt-md-0">
          <button className="btn btn-outline-primary w-100" disabled={loading}>
            {loading ? "Escaneando..." : "Escanear Web"}
          </button>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </form>
  );
};

export default WebScanForm;
