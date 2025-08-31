import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRouter.js';
import resumeRoutes from './routes/resumeRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/resume', resumeRoutes);

// Serve uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, _path) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    },
  })
);

// Root route
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
