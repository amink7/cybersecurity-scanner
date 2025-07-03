// ResultsTable.jsx
import React from "react";
import Table from "react-bootstrap/Table";

const ResultsTable = ({ data }) => {
  if (!data || !data.length) return <div>No hay resultados</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Riesgo</th>
          <th>Descripción</th>
          <th>URL</th>
          <th>Solución</th>
        </tr>
      </thead>
      <tbody>
        {data.map((alert, i) => (
          <tr key={i}>
            <td>{alert.risk || alert.riskdesc || "N/A"}</td>
            <td>{alert.name || alert.description || "N/A"}</td>
            <td>{alert.url || alert.instances?.[0]?.uri || "N/A"}</td>
            <td>{alert.solution || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ResultsTable;
