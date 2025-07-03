import React from "react";
import Layout from "../components/Layout";

const Dashboard = () => (
  <Layout>
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "#f8fafd" }}>
      <div className="card shadow-lg p-4" style={{ minWidth: 380, borderRadius: 18 }}>
        <div className="mb-3 text-center">
          <img src="https://img.icons8.com/color/64/security-checked--v1.png" alt="dashboard" />
          <h2 className="fw-bold mt-3" style={{ fontSize: 30 }}>¡Bienvenido!</h2>
          <p className="text-muted mt-2" style={{ fontSize: 16 }}>
            Gestiona y ejecuta tus escaneos de ciberseguridad de forma sencilla y profesional.<br />
            <b>¿Qué quieres hacer hoy?</b>
          </p>
        </div>
        <div className="d-flex flex-column gap-3">
          <a href="/scan" className="btn btn-primary btn-lg fw-bold">Escaneo Web (OWASP ZAP)</a>
          <a href="/ports" className="btn btn-success btn-lg fw-bold">Escaneo de Puertos (Nmap)</a>
          <a href="/client-info" className="btn btn-info btn-lg fw-bold text-white">Información del Cliente</a>
          <a href="/reports" className="btn btn-outline-dark btn-lg fw-bold">Ver Informes</a>
        </div>
      </div>
    </div>
  </Layout>
);

export default Dashboard;
