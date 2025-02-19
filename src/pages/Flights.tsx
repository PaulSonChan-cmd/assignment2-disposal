"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Row, Col, Alert, Image, Spinner } from "react-bootstrap"
import { searchFlights, searchDestinations } from "../services/api"


interface Destination {
  id: string
  name: string
  cityName: string
  photoUri: string
  type: string
}

interface Flight {
  id: string
  price: number
  currency: string
  outbound: {
    airline: string
    flightNumber: string
    departure: string
    arrival: string
    origin: string
    destination: string
  } | null
  inbound: {
    airline: string
    flightNumber: string
    departure: string
    arrival: string
    origin: string
    destination: string
  } | null
}

export default function Flights() {
  const [searchParams, setSearchParams] = useState({
    fromId: "",
    toId: "",
    departDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // 今天
    returnDate: new Date(Date.now() + 259200000).toISOString().split("T")[0], // 今天 + 2 天
    adults: "1",
    children: "0",
    cabinClass: "ECONOMY",
    currency_code: "HKD",
  })
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedFrom, setSelectedFrom] = useState<Destination | null>(null)
  const [selectedTo, setSelectedTo] = useState<Destination | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams({ ...searchParams, [name]: value })

    if (name === "fromId") {
      const selected = destinations.find((dest) => dest.id === value)
      setSelectedFrom(selected || null)
    } else if (name === "toId") {
      const selected = destinations.find((dest) => dest.id === value)
      setSelectedTo(selected || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const results = await searchFlights(searchParams)
      setFlights(results)
    } catch (error) {
      setError("Error searching flights. Please try again.")
      console.error("Error searching flights:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await searchDestinations("new")
      setDestinations(results)
    } catch (error) {
      setError("Error fetching destinations. Please try again.")
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  return (
    <Container>
      <h2 className="text-center mb-4">Search Flights</h2>
      <Form onSubmit={handleSubmit} className="mb-5">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Select name="fromId" value={searchParams.fromId} onChange={handleInputChange} required>
                <option value="">Select departure</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} ({dest.type})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedFrom && (
              <div className="mb-3">
                <Image
                  src={selectedFrom.photoUri || "/placeholder.svg"}
                  alt={selectedFrom.cityName}
                  thumbnail
                  width={150}
                  height={150}
                />
                <p>{selectedFrom.cityName || selectedFrom.name}</p>
              </div>
            )}
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Select name="toId" value={searchParams.toId} onChange={handleInputChange} required>
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} ({dest.type})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedTo && (
              <div className="mb-3">
                <Image
                  src={selectedTo.photoUri || "/placeholder.svg"}
                  alt={selectedTo.cityName}
                  thumbnail
                  width={150}
                  height={150}
                />
                <p>{selectedTo.cityName || selectedTo.name}</p>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Departure Date</Form.Label>
              <Form.Control
                type="date"
                name="departDate"
                value={searchParams.departDate}
                onChange={handleInputChange}
                required
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Return Date</Form.Label>
              <Form.Control
                type="date"
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleInputChange}
                required
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Adults</Form.Label>
              <Form.Control
                type="number"
                name="adults"
                value={searchParams.adults}
                onChange={handleInputChange}
                min="1"
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Children</Form.Label>
              <Form.Control
                type="number"
                name="children"
                value={searchParams.children}
                onChange={handleInputChange}
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Cabin Class</Form.Label>
              <Form.Select name="cabinClass" value={searchParams.cabinClass} onChange={handleInputChange}>
                <option value="ECONOMY">ECONOMY</option>
                <option value="PREMIUM_ECONOMY">PREMIUM_ECONOMY</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="FIRST">FIRST</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                type="text"
                name="currency_code"
                value={searchParams.currency_code}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="text-center mb-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {flights.map((flight) => (
          <Col md={6} key={flight.id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>
                  {flight.outbound?.origin} to {flight.outbound?.destination}
                </Card.Title>
                <Card.Text>
                  <strong>Price:</strong> {flight.price} {flight.currency}
                  <br />
                  <strong>Outbound:</strong>
                  <br />
                  {flight.outbound?.airline} - {flight.outbound?.flightNumber}
                  <br />
                  Departure: {flight.outbound?.departure ? new Date(flight.outbound.departure).toLocaleString() : "N/A"}
                  <br />
                  Arrival: {flight.outbound?.arrival ? new Date(flight.outbound.arrival).toLocaleString() : "N/A"}
                  <br />
                  {flight.inbound && (
                    <>
                      <strong>Inbound:</strong>
                      <br />
                      {flight.inbound.airline} - {flight.inbound.flightNumber}
                      <br />
                      Departure: {new Date(flight.inbound.departure).toLocaleString()}
                      <br />
                      Arrival: {new Date(flight.inbound.arrival).toLocaleString()}
                    </>
                  )}
                </Card.Text>
                <Button variant="outline-primary" className="w-100">
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}