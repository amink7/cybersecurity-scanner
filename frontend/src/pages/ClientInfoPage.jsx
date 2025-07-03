import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Row, Col, Table } from "react-bootstrap";
import { getClientDetails, getClientFingerprint, analyzeUserAgent, getGeoIp } from "../api";

const ClientInfoPage = () => {
  const [details, setDetails] = useState({});
  const [fingerprint, setFingerprint] = useState({});
  const [userAgent, setUserAgent] = useState({});
  const [geoIp, setGeoIp] = useState({});

  useEffect(() => {
    getClientDetails().then(res => setDetails(res.data));
    getClientFingerprint().then(res => setFingerprint(res.data));
    analyzeUserAgent().then(res => setUserAgent(res.data));
    getGeoIp().then(res => setGeoIp(res.data));
  }, []);

  return (
    <Layout>
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>IP y Headers</Card.Title>
              <Card.Text><b>IP:</b> {details.ip}</Card.Text>
              <Card.Text><b>User Agent:</b> {details.userAgent}</Card.Text>
              <Table striped size="sm">
                <tbody>
                  {details.headers &&
                    Object.entries(details.headers).map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>Fingerprint</Card.Title>
              <Card.Text>
                <b>Fingerprint:</b> {fingerprint.fingerprint}
                <br />
                <b>IP:</b> {fingerprint.ip}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>User Agent</Card.Title>
              <Card.Text>
                <b>SO:</b> {userAgent.os} <br />
                <b>Navegador:</b> {userAgent.browser}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>Ubicación</Card.Title>
              {geoIp && geoIp.geoip && (
                <pre style={{ fontSize: "0.8em" }}>{JSON.stringify(JSON.parse(geoIp.geoip), null, 2)}</pre>
              )}
              {geoIp.geoip_error && <div>Error: {geoIp.geoip_error}</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default ClientInfoPage;
