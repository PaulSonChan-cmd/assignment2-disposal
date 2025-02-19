import express from "express"
import axios from "axios"

const router = express.Router()

const BOOKING_API_URL = "https://booking-com15.p.rapidapi.com/api/v1/flights"
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "7d27141009"

router.get("/search", async (req, res) => {
  try {
    const { fromId, toId, departDate, returnDate, adults, children, cabinClass, currency_code } = req.query

    const options = {
      method: "GET",
      url: `${BOOKING_API_URL}/searchFlights`,
      params: {
        fromId,
        toId,
        departDate,
        returnDate,
        pageNo: "1",
        adults,
        children: children || "0",
        sort: "BEST",
        cabinClass,
        currency_code,
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }

    const response = await axios.request(options)

    // Check if the expected data structure exists
    if (!response.data || !response.data.data || !response.data.data.flightOffers) {
      throw new Error("Unexpected API response structure")
    }

    // Transform the API response to match our frontend expectations
    const flights = response.data.data.flightOffers.map((offer: any) => ({
      id: offer.token || "Unknown",
      price: offer.priceBreakdown?.total?.units || 0,
      currency: offer.priceBreakdown?.total?.currencyCode || "Unknown",
      outbound:
        offer.segments && offer.segments[0]
          ? {
              airline: offer.segments[0].legs[0]?.carriers?.[0] || "Unknown",
              flightNumber: `${offer.segments[0].legs[0]?.carriers?.[0] || ""}${offer.segments[0].legs[0]?.flightInfo?.flightNumber || ""}`,
              departure: offer.segments[0].legs[0]?.departureTime || "Unknown",
              arrival: offer.segments[0].legs[0]?.arrivalTime || "Unknown",
              origin: offer.segments[0].legs[0]?.departureAirport?.name || "Unknown",
              destination: offer.segments[0].legs[0]?.arrivalAirport?.name || "Unknown",
            }
          : null,
      inbound:
        offer.segments && offer.segments[1]
          ? {
              airline: offer.segments[1].legs[0]?.carriers?.[0] || "Unknown",
              flightNumber: `${offer.segments[1].legs[0]?.carriers?.[0] || ""}${offer.segments[1].legs[0]?.flightInfo?.flightNumber || ""}`,
              departure: offer.segments[1].legs[0]?.departureTime || "Unknown",
              arrival: offer.segments[1].legs[0]?.arrivalTime || "Unknown",
              origin: offer.segments[1].legs[0]?.departureAirport?.name || "Unknown",
              destination: offer.segments[1].legs[0]?.arrivalAirport?.name || "Unknown",
            }
          : null,
    }))

    res.json(flights)
  } catch (error) {
    console.error("Error searching flights:", error)
    res.status(500).json({ message: "Error searching flights", error: error })
  }
})

router.get("/destinations", async (req, res) => {
  try {
    const { query } = req.query

    const options = {
      method: "GET",
      url: `${BOOKING_API_URL}/searchDestination`,
      params: { query },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }

    const response = await axios.request(options)
    const destinations = response.data.data.map((dest: any) => ({
      id: dest.id,
      name: dest.name,
      cityName: dest.cityName,
      photoUri: dest.photoUri,
      type: dest.type,
    }))

    res.json(destinations)
  } catch (error) {
    console.error("Error searching destinations:", error)
    res.status(500).json({ message: "Error searching destinations", error: error })
  }
})

export default router

