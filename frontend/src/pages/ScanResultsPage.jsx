import React from "react";
import Layout from "../components/Layout";
import ResultsTable from "../components/ResultsTable";

const ScanResultsPage = () => (
  <Layout>
    <div className="container">
      <h2 className="mt-3 mb-4">Resultados del Escaneo</h2>
      <ResultsTable />
    </div>
  </Layout>
);

export default ScanResultsPage;
