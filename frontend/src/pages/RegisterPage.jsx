import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { register } from "../api";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== repeat) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const res = await register(username, password);
      if (res.data && typeof res.data === "string" && !res.data.toLowerCase().includes("incorrectos")) {
        localStorage.setItem("token", res.data);
        navigate("/");
      } else {
        setError("No se pudo registrar. Intenta con otro usuario.");
      }
    } catch (err) {
      setError("No se pudo registrar. Intenta con otro usuario.");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "#f8fafd" }}>
        <div className="card shadow-lg p-4" style={{ minWidth: 370, maxWidth: 400, borderRadius: 18 }}>
          <div className="mb-4 text-center">
            <img src="https://img.icons8.com/fluency/48/add-user-group-man-man.png" alt="register" />
            <h2 className="fw-bold mt-2" style={{ fontSize: 28 }}>Registro</h2>
            <p className="text-muted mb-0" style={{ fontSize: 15 }}>Crea tu cuenta en CyberSecurity Scanner</p>
          </div>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 17 }}>Usuario</label>
              <input className="form-control form-control-lg" style={{ fontSize: 17 }} value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 17 }}>Contraseña</label>
              <input className="form-control form-control-lg" style={{ fontSize: 17 }} type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 17 }}>Repite Contraseña</label>
              <input className="form-control form-control-lg" style={{ fontSize: 17 }} type="password" value={repeat} onChange={e => setRepeat(e.target.value)} />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button className="btn btn-success w-100 py-2 mt-2 fw-bold" style={{ fontSize: 17 }}>Registrarse</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
