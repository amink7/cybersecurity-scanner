// src/components/Sidebar.jsx
import React from "react";

const Sidebar = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-start"
    style={{
      width: 220,
      minHeight: "100vh",
      background: "#1375fd",
      color: "#fff",
      paddingTop: 32,
      fontWeight: 500,
      boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
    }}
  >
    <h5 className="mb-4">Cybersecurity<br />Scanner</h5>
    <ul className="nav flex-column w-100">
      <li className="nav-item"><a className="nav-link text-white" href="/">Dashboard</a></li>
      <li className="nav-item"><a className="nav-link text-white" href="/scan">Escanear</a></li>
      <li className="nav-item"><a className="nav-link text-white" href="/ports">Puertos</a></li>
      <li className="nav-item"><a className="nav-link text-white" href="/zap">Web (ZAP)</a></li>
      <li className="nav-item"><a className="nav-link text-white" href="/reports">Informes</a></li>
      <li className="nav-item"><a className="nav-link text-white" href="/client-info">Info Cliente</a></li>
    </ul>
  </div>
);

export default Sidebar;
