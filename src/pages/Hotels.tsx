"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap"
import { searchHotels, searchHotelsDestinations } from "../services/api"

interface Destination {
  dest_id: string
  name: string
  city_name: string
  country: string
  label: string
  search_type: string
}

interface Hotel {
  id: string
  name: string
  address: string
  reviewScore: number
  reviewScoreWord: string
  price: number
  currencyCode: string
  photoUrl: string
}

export default function Hotels() {
  const [searchParams, setSearchParams] = useState({
    dest_id: "",
    search_type: "CITY",
    arrival_date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // 今天
    departure_date: new Date(Date.now() + 259200000).toISOString().split("T")[0], // 今天 + 2 天
    adults: "1",
    children_age: "",
    room_qty: "1",
    currency_code: "HKD",
  })
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "dest_id") {
      const selectedDestination = destinations.find(dest => dest.dest_id === value);
      const updatedSearchType = selectedDestination ? selectedDestination.search_type : "CITY";
      setSearchParams({ ...searchParams, [name]: value, search_type: updatedSearchType });
    } else {
      setSearchParams({ ...searchParams, [name]: value });
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const results = await searchHotels(searchParams)
      setHotels(results)
    } catch (error) {
      setError("Error searching hotels. Please try again.")
      console.error("Error searching hotels:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await searchHotelsDestinations("man") // You can change "man" to any default search term
      setDestinations(results)
    } catch (error) {
      setError("Error fetching destinations. Please try again.")
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minArrivalDate = tomorrow.toISOString().split("T")[0]

  return (
    <Container>
      <h2 className="text-center mb-4">Search Hotels</h2>
      <Form onSubmit={handleSubmit} className="mb-5">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Select name="dest_id" value={searchParams.dest_id} onChange={handleInputChange} required>
                <option value="">Select a destination</option>
                {destinations.map((dest) => (
                  <option key={dest.dest_id} value={dest.dest_id}>
                    {dest.label}, {dest.search_type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Check-in</Form.Label>
              <Form.Control
                type="date"
                name="arrival_date"
                value={searchParams.arrival_date}
                onChange={handleInputChange}
                required
                min={minArrivalDate}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Check-out</Form.Label>
              <Form.Control
                type="date"
                name="departure_date"
                value={searchParams.departure_date}
                onChange={handleInputChange}
                required
                min={searchParams.arrival_date || minArrivalDate}
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
              <Form.Label>Children Ages</Form.Label>
              <Form.Control
                type="text"
                name="children_age"
                value={searchParams.children_age}
                onChange={handleInputChange}
                placeholder="e.g., 5,7,12"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Rooms</Form.Label>
              <Form.Control
                type="number"
                name="room_qty"
                value={searchParams.room_qty}
                onChange={handleInputChange}
                min="1"
                required
              />
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
        <div className="text-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Searching...
              </>
            ) : (
              "Search Hotels"
            )}
          </Button>
        </div>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {hotels.map((hotel) => (
          <Col md={4} key={hotel.id}>
            <Card className="mb-4">
              <Card.Img variant="top" src={hotel.photoUrl} alt={hotel.name} />
              <Card.Body>
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {hotel.address}
                  <br />
                  <strong>Review Score:</strong> {hotel.reviewScore} ({hotel.reviewScoreWord})
                  <br />
                  <strong>Price:</strong> {hotel.price} {hotel.currencyCode}
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