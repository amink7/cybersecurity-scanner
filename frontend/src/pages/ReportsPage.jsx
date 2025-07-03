import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getReports, downloadReport } from "../api";
import { Container, Row, Col, Card, Table, Alert, Button, Spinner } from "react-bootstrap";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getReports()
      .then((res) => setReports(res.data))
      .catch(() => setError("No se pudieron obtener los informes"));
  }, []);

  const handleDownload = async (id, format = "json") => {
    setDownloading(true);
    try {
      const res = await downloadReport(id, format);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte-${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Error al descargar el informe.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <Container fluid className="py-5" style={{ minHeight: "100vh", background: "#f7fafd" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9}>
            <Card className="shadow-lg" style={{ borderRadius: 16 }}>
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src="https://img.icons8.com/fluency/48/000000/report-card.png"
                    alt="Reports"
                    style={{ height: 40, marginBottom: 6 }}
                  />
                  <h2 className="fw-bold">Informes de Escaneo</h2>
                  <p className="text-muted" style={{ fontSize: 17 }}>
                    Consulta y descarga los resultados de tus análisis de ciberseguridad.
                  </p>
                </div>
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                <div style={{ overflowX: "auto" }}>
                  <Table bordered hover responsive style={{ minWidth: 560 }}>
                    <thead className="table-primary">
                      <tr style={{ fontSize: 17 }}>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No hay informes disponibles aún.
                          </td>
                        </tr>
                      )}
                      {reports.map((r) => (
                        <tr key={r.id} style={{ fontSize: 16 }}>
                          <td>{r.id}</td>
                          <td>{r.username}</td>
                          <td>{new Date(r.date).toLocaleString()}</td>
                          <td>
                            <span className="badge bg-info text-dark">{r.type}</span>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              className="me-2"
                              variant="primary"
                              disabled={downloading}
                              onClick={() => handleDownload(r.id, "json")}
                            >
                              {downloading ? <Spinner size="sm" /> : "Descargar JSON"}
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={downloading}
                              onClick={() => handleDownload(r.id, "csv")}
                            >
                              {downloading ? <Spinner size="sm" /> : "Descargar CSV"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default ReportsPage;
