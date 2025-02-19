import type React from "react"
import { Navbar, Nav, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
  return (
    <Navbar bg="white" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-weight-bold">
          <span role="img" aria-label="airplane">
            ✈️
          </span>{" "}
          Wanderlust Travel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/hotels">
              Hotels
            </Nav.Link>
            <Nav.Link as={Link} to="/flights">
              Flights
            </Nav.Link>
            <Nav.Link as={Link} to="/reservations">
              Reservations
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header

