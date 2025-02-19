import express from "express"
import axios from "axios"

const router = express.Router()

const BOOKING_API_URL = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "7d27141009"

router.get("/search", async (req, res) => {
  try {
    const { dest_id, search_type, arrival_date, departure_date, adults, children_age, room_qty, currency_code } =
      req.query

    const options = {
      method: "GET",
      url: BOOKING_API_URL,
      params: {
        dest_id,
        search_type,
        arrival_date,
        departure_date,
        adults,
        children_age,
        room_qty,
        page_number: "1",
        units: "metric",
        temperature_unit: "c",
        languagecode: "en-us",
        currency_code,
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }

    const response = await axios.request(options)

    // Transform the API response to match our frontend expectations
    const hotels = response.data.data.hotels.map((hotel: any) => ({
      id: hotel.hotel_id,
      name: hotel.property?.name || "Unknown",
      address: `${hotel.property?.latitude || 0}, ${hotel.property?.longitude || 0}`,
      reviewScore: hotel.property?.reviewScore || 0,
      reviewScoreWord: hotel.property?.reviewScoreWord || "No reviews",
      price: hotel.property?.priceBreakdown?.grossPrice?.value || 0,
      currencyCode: hotel.property?.priceBreakdown?.grossPrice?.currency || currency_code,
      photoUrl: hotel.property?.photoUrls?.[0] || "/placeholder.svg",
    }))

    res.json(hotels)
  } catch (error) {
    console.error("Error searching hotels:", error)
    res.status(500).json({ message: "Error searching hotels", error: error })
  }
})

router.get("/destinations", async (req, res) => {
  try {
    const { query } = req.query

    const options = {
      method: "GET",
      url: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination",
      params: { query },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }

    const response = await axios.request(options)
    const destinations = response.data.data.map((dest: any) => ({
      dest_id: dest.dest_id,
      name: dest.name,
      city_name: dest.city_name,
      country: dest.country,
      label: dest.label,
      search_type: dest.search_type,
    }))

    res.json(destinations)
  } catch (error) {
    console.error("Error searching destinations:", error)
    res.status(500).json({ message: "Error searching destinations", error: error })
  }
})

export default router

