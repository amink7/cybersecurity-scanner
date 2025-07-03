import React from "react";
import { Card, Table, Badge, Accordion } from "react-bootstrap";

const riskColor = (risk) => {
  switch (risk) {
    case "High": return "danger";
    case "Medium": return "warning";
    case "Low": return "info";
    default: return "secondary";
  }
};

const ZapResults = ({ results }) => {
  if (!results || !results.alerts || results.alerts.length === 0) {
    return <Card body>No se encontraron vulnerabilidades con ZAP.</Card>;
  }

  return (
    <Accordion defaultActiveKey="0">
      {results.alerts.map((alert, idx) => (
        <Accordion.Item eventKey={idx.toString()} key={alert.id || idx}>
          <Accordion.Header>
            <span>
              <Badge bg={riskColor(alert.risk)} className="me-2">
                {alert.risk}
              </Badge>
              {alert.name} ({alert.url})
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <th>Descripción</th>
                  <td>{alert.description}</td>
                </tr>
                <tr>
                  <th>Solución</th>
                  <td>{alert.solution}</td>
                </tr>
                <tr>
                  <th>Confianza</th>
                  <td>{alert.confidence}</td>
                </tr>
                <tr>
                  <th>Parámetro</th>
                  <td>{alert.param}</td>
                </tr>
                <tr>
                  <th>Evidencia</th>
                  <td>{alert.evidence}</td>
                </tr>
                <tr>
                  <th>Referencia</th>
                  <td>
                    {alert.reference && alert.reference.split("\n").map((ref, i) =>
                      <div key={i}>
                        {ref.startsWith("http") ? (
                          <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                        ) : ref}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ZapResults;
