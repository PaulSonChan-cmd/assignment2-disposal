import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hotelRoutes from './routes/hotelRoutes';
import flightRoutes from './routes/flightRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});