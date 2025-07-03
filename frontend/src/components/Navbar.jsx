import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";

const MyNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" className="shadow-sm" style={{ height: 64 }}>
      <Container fluid>
        <Navbar.Brand style={{ fontWeight: "bold" }}>
          Cybersecurity Scanner
        </Navbar.Brand>
        <Button variant="danger" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Container>
    </Navbar>
  );
};
export default MyNavbar;
