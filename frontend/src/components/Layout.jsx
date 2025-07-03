// src/components/Layout.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Layout.css"

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ejemplo simple de auth, puedes usar tu contexto o localStorage/token
  const isLoggedIn = !!localStorage.getItem("token");

  // Mostrar u ocultar botones según ruta y login
  const showLogin = !isLoggedIn && location.pathname !== "/login";
  const showRegister = !isLoggedIn && location.pathname !== "/register";
  const showLogout = isLoggedIn;

  const handleLogout = () => {
    localStorage.removeItem("token");
    // ...y más cosas si tienes auth real
    navigate("/login");
  };

  return (
    <div>
      {/* Barra superior */}
      <nav
        style={{
          width: "100%",
          height: 56,
          background: "#177cff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          boxSizing: "border-box",
          boxShadow: "0 1px 8px 0 #0001",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: -1,
          }}
        >
          🛡️ Cybersecurity Scanner
        </span>
        <div>
          {showLogin && (
            <button
              onClick={() => navigate("/login")}
              style={buttonStyle}
            >
              Login
            </button>
          )}
          {showRegister && (
            <button
              onClick={() => navigate("/register")}
              style={{ ...buttonStyle, background: "#45b36b" }}
            >
              Registrarse
            </button>
          )}
          {showLogout && (
            <button
              onClick={handleLogout}
              style={{ ...buttonStyle, background: "#ef4444" }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>
      {/* Sidebar y contenido */}
      <div style={{ display: "flex", minHeight: "100vh", paddingTop: 56 }}>
        <aside
          style={{
            background: "#1877ff",
            color: "#fff",
            width: 220,
            padding: "2rem 1rem 1rem 1rem",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 30, fontSize: 18 }}>
            Cybersecurity<br />Scanner
          </div>
          {/* Aquí tu menú lateral */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={sidebarLink} onClick={() => navigate("/")}>Dashboard</li>
            <li style={sidebarLink} onClick={() => navigate("/scan")}>Escanear</li>
            <li style={sidebarLink} onClick={() => navigate("/ports")}>Puertos</li>
            <li style={sidebarLink} onClick={() => navigate("/web-vuln")}>Web (ZAP)</li>
            <li style={sidebarLink} onClick={() => navigate("/reports")}>Informes</li>
            <li style={sidebarLink} onClick={() => navigate("/client-info")}>Info Cliente</li>
          </ul>
        </aside>
        {/* Main */}
        <main style={{
          flex: 1,
          padding: "2.5rem",
          background: "#f6f8fc",
          minHeight: "calc(100vh - 56px)"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "#2563eb",
  border: "none",
  color: "#fff",
  padding: "8px 18px",
  marginLeft: 8,
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 15,
  letterSpacing: "-0.5px"
};

const sidebarLink = {
  padding: "9px 0",
  cursor: "pointer",
  borderRadius: 6,
  marginBottom: 6,
  transition: "background 0.14s",
  fontSize: 15
};

export default Layout;
