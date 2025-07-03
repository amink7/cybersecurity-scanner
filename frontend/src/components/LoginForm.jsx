import React, { useState } from "react";
import { login } from "../api";

const LoginForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.data);
      onSuccess();
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
    setLoading(false);
  };

  return (
    <form className="p-4 border rounded bg-white" style={{ maxWidth: 400, margin: "0 auto" }} onSubmit={handleSubmit}>
      <h4 className="mb-3 text-center">Iniciar sesión</h4>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};

export default LoginForm;
