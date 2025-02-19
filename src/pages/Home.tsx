import type React from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1 className="text-center mb-4">Welcome to Wanderlust Travel</h1>
          <p className="text-center lead mb-5">Explore hotels and flights for your next adventure!</p>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title as="h2">Find Hotels</Card.Title>
              <Card.Text>Discover comfortable accommodations for your stay.</Card.Text>
              <Button as={Link} to="/hotels" variant="primary" size="lg">
                Search Hotels
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title as="h2">Book Flights</Card.Title>
              <Card.Text>Find the best deals on flights to your destination.</Card.Text>
              <Button as={Link} to="/flights" variant="primary" size="lg">
                Search Flights
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home

