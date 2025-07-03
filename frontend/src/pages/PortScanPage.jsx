import React, { useState } from "react";
import Layout from "../components/Layout";
import { scanPorts } from "../api";
import { Table, Form, Button, Alert, Spinner } from "react-bootstrap";
import "../styles/PortScanPage.css"; // Asegúrate de importar el CSS

const PORT_SERVICES = {
  22: "SSH",
  80: "HTTP",
  443: "HTTPS",
  3306: "MySQL",
  8080: "HTTP-Alt",
  5432: "PostgreSQL",
};

const PortScanPage = () => {
  const [target, setTarget] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setLoading(true);

    try {
      const response = await scanPorts(target.trim());
      setResults(
        response.data?.ports ? response.data :
        response.data.results ? response.data.results :
        {}
      );
    } catch (err) {
      setError("No se pudo realizar el escaneo de puertos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="centered-content">
        <div className="scan-card">
          <div className="scan-title">
            <span role="img" aria-label="eye" style={{ fontSize: 32 }}>👁️</span>
            <h2>Escaneo de Puertos</h2>
            <div className="scan-desc">Descubre los puertos abiertos y expuestos de cualquier host.</div>
          </div>
          <Form onSubmit={handleScan} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Ejemplo: scanme.nmap.org"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              className="mb-2"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {" "}Escaneando...
                </>
              ) : (
                "Escanear Puertos"
              )}
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-2 text-center">{error}</Alert>}
        </div>

        {results && results.ports && (
          <div className="results-table-container">
            <div className="results-title">
              Resultados para: <b>{results.target}</b>
            </div>
            <div style={{ overflowX: "auto" }}>
              <Table bordered hover responsive style={{ minWidth: 420 }}>
                <thead className="table-primary">
                  <tr>
                    <th>Puerto</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results.ports).map(([port, open]) => (
                    <tr key={port}>
                      <td>{port}</td>
                      <td>{PORT_SERVICES[port] || "-"}</td>
                      <td>
                        {open ? (
                          <span className="fw-bold text-success">Abierto</span>
                        ) : (
                          <span className="fw-bold text-danger">Cerrado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {results && !results.ports && (
          <Alert variant="info" className="text-center mt-3">
            No hay resultados disponibles para este escaneo.
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default PortScanPage;
