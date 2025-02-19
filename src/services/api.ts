import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

export const searchHotels = async (params: any) => {
  const response = await axios.get(`${API_BASE_URL}/hotels/search`, { params })
  return response.data
}

export const searchFlights = async (params: {
  fromId: string
  toId: string
  departDate: string
  returnDate: string
  adults: string
  children: string
  cabinClass: string
  currency_code: string
}) => {
  const response = await axios.get(`${API_BASE_URL}/flights/search`, { params })
  return response.data
}

export const searchDestinations = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/flights/destinations`, { params: { query } })
  return response.data
}

export const searchHotelsDestinations = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/hotels/destinations`, { params: { query } })
  return response.data
}

export const register = async (userData: { username: string; email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
  return response.data
}

export const login = async (credentials: { username: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
  return response.data
}

