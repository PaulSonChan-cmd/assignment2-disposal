import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"
import Header from "./components/Header"
import Home from "./pages/Home"
import Hotels from "./pages/Hotels"
import Flights from "./pages/Flights"
import Reservations from "./pages/Reservations"
import Register from "./pages/Register"
import Login from "./pages/Login"

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

const App: React.FC = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Container className="flex-grow-1 mt-3 mb-5 pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
        <footer className="bg-light py-3 mt-auto">
          <Container>
            <p className="text-center mb-0">&copy; 2025 Travel App. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </Router>
  )
}

export default App

