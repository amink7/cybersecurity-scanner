import React, { useState } from "react";
import { register } from "../api";

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    try {
      await register(username, password);
      onSuccess();
    } catch (err) {
      setError("No se pudo registrar. Intenta con otro usuario.");
    }
    setLoading(false);
  };

  return (
    <form className="p-4 border rounded bg-white" style={{ maxWidth: 400, margin: "0 auto" }} onSubmit={handleSubmit}>
      <h4 className="mb-3 text-center">Registro</h4>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Repite Contraseña</label>
        <input className="form-control" type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-success w-100" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
};

export default RegisterForm;
