const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.16.101:5173',
  'https://savari-alpha.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}

export default corsOptions;