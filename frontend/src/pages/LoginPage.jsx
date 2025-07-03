import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { login } from "../api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(username, password);
      if (res.data && typeof res.data === "string" && !res.data.toLowerCase().includes("incorrectos")) {
        localStorage.setItem("token", res.data);
        navigate("/");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "#f8fafd" }}>
        <div className="card shadow-lg p-4" style={{ minWidth: 370, maxWidth: 400, borderRadius: 18 }}>
          <div className="mb-4 text-center">
            <img src="https://img.icons8.com/fluency/48/lock.png" alt="login" />
            <h2 className="fw-bold mt-2" style={{ fontSize: 28 }}>Iniciar Sesión</h2>
            <p className="text-muted mb-0" style={{ fontSize: 15 }}>Bienvenido a CyberSecurity Scanner</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 17 }}>Usuario</label>
              <input className="form-control form-control-lg" style={{ fontSize: 17 }} value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: 17 }}>Contraseña</label>
              <input className="form-control form-control-lg" style={{ fontSize: 17 }} type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button className="btn btn-primary w-100 py-2 mt-2 fw-bold" style={{ fontSize: 17 }}>Entrar</button>
          </form>
          <div className="text-center mt-4">
            <span style={{ fontSize: 15 }}>¿No tienes cuenta? </span>
            <a href="/register" className="btn btn-link px-1" style={{ fontSize: 15 }}>Regístrate</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
