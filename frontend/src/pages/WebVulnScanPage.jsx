import React from "react";
import Layout from "../components/Layout";
import WebScanForm from "../components/WebScanForm";

const WebVulnScanPage = () => (
  <Layout>
    <div className="container">
      <h2 className="mt-3 mb-4">Escaneo de Vulnerabilidades Web</h2>
      <WebScanForm />
    </div>
  </Layout>
);

export default WebVulnScanPage;
