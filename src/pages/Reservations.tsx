import type React from "react"
import { Container, Table } from "react-bootstrap"

interface Reservation {
  id: string
  type: "hotel" | "flight"
  name: string
  date: string
  status: string
}

const Reservations: React.FC = () => {
  // TODO: Fetch reservations from API
  const dummyReservations: Reservation[] = [
    { id: "1", type: "hotel", name: "Luxury Hotel", date: "2023-06-15", status: "Confirmed" },
    { id: "2", type: "flight", name: "SkyHigh Airways", date: "2023-06-20", status: "Pending" },
  ]

  return (
    <Container>
      <h2>My Reservations</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.type === "hotel" ? "Hotel" : "Flight"}</td>
              <td>{reservation.name}</td>
              <td>{reservation.date}</td>
              <td>{reservation.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Reservations

