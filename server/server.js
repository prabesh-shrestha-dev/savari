import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import authRouter from './routes/auth.js';
import documentRouter from './routes/document.js';
import connectDB from './config/dbConn.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.use('/auth', authRouter);

app.use("/documents", documentRouter);

app.use((err, req, res, next) => {
  console.error("Detailed Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    })
  } catch (err) {
    console.error('MongoDB error: ', err);
    process.exit(1);
  }
}

startServer();