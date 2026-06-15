import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

app.use('/api/contact', contactRoutes);

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('MongoDB connection failed — contact messages will not be saved:', error.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Stop the other backend process or change PORT in .env`
      );
      process.exit(1);
    }
    throw err;
  });
}

startServer();
