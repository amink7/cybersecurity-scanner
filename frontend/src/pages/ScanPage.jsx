import React, { useState } from "react";
import Layout from "../components/Layout";
import { scanWeb } from "../api";
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, Badge, Card } from "react-bootstrap";

const riskColor = {
  "High": "danger",
  "Medium": "warning",
  "Low": "info",
  "Informational": "secondary",
  "": "light"
};

const ScanPage = () => {
  const [targetUrl, setTargetUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await scanWeb(targetUrl.trim());
      if (res.data.success && Array.isArray(res.data.results)) {
        setResults(res.data.results);
      } else {
        setError(res.data.error || "Error desconocido");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Container className="py-5" style={{ minHeight: "100vh" }}>
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={10} lg={9}>
            <Card className="shadow-lg" style={{ borderRadius: 16 }}>
              <Card.Body>
                <div className="text-center mb-3">
                  <img
                    src="https://img.icons8.com/fluency/48/shield-with-exclamation-mark.png"
                    alt="Vuln"
                    style={{ height: 40, marginBottom: 6 }}
                  />
                  <h2 className="fw-bold">Escaneo de Vulnerabilidades Web (OWASP ZAP)</h2>
                  <p className="text-muted" style={{ fontSize: 17 }}>
                    Analiza cualquier web pública y descubre posibles riesgos y vulnerabilidades en segundos.
                  </p>
                </div>
                <Form onSubmit={handleScan} className="mb-3">
                  <Row>
                    <Col xs={12} md={9}>
                      <Form.Control
                        type="url"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="Ejemplo: https://www.ejemplo.com/"
                        required
                        size="lg"
                        autoFocus
                        className="mb-2 mb-md-0"
                      />
                    </Col>
                    <Col xs={12} md={3}>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-100"
                        variant="primary"
                        disabled={loading || !targetUrl}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" /> Escaneando...
                          </>
                        ) : (
                          "Escanear"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>

                {error && (
                  <Alert variant="danger" className="text-center fw-bold">
                    {error}
                  </Alert>
                )}

                {results.length > 0 && (
                  <div className="mt-5">
                    <h4 className="mb-4 text-center fw-semibold text-primary">
                      Resultados del escaneo
                    </h4>
                    <Table bordered hover responsive size="sm" className="shadow-sm" style={{ fontSize: 16 }}>
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>Vulnerabilidad</th>
                          <th>Nivel</th>
                          <th>URLs afectadas</th>
                          <th>Descripción</th>
                          <th>Solución</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, idx) => (
                          <tr key={idx}>
                            <td className="fw-bold">{idx + 1}</td>
                            <td>{r.alert}</td>
                            <td>
                              <Badge bg={riskColor[r.risk] || "secondary"} className="px-2 py-1">
                                {r.risk}
                              </Badge>
                            </td>
                            <td>
                              <ul className="mb-0" style={{ paddingLeft: 18 }}>
                                {(r.urls || []).slice(0, 5).map((url, i) => (
                                  <li key={i} style={{ wordBreak: "break-all" }}>{url}</li>
                                ))}
                                {r.urls && r.urls.length > 5 && (
                                  <li>...y {r.urls.length - 5} más</li>
                                )}
                              </ul>
                            </td>
                            <td style={{ minWidth: 180, maxWidth: 340, whiteSpace: "pre-line" }}>
                              {r.description}
                            </td>
                            <td style={{ minWidth: 160, maxWidth: 300, whiteSpace: "pre-line" }}>
                              {r.solution}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {(!loading && results.length === 0 && !error) && (
                  <div className="text-center text-muted py-5">
                    Introduce una URL arriba y pulsa <b>Escanear</b> para ver vulnerabilidades web.
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default ScanPage;
