import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import kidRoutes from './routes/kidRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [
      'http://localhost:5173',
      'https://wheeliz-web.vercel.app',
      'https://wheeliz-production.up.railway.app'
    ];

app.use(cors({
  origin: function (origin, callback) {

    // Allow requests with no origin (Postman, mobile apps, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin); // DEBUG
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true
}));


app.options('*', cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'Wheeliz API Server',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      admin: '/api/admin',
      kid: '/api/kid'
    }
  });
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wheeliz Dashboard Squad API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${PORT}`
      }
    ],
  },
  apis: ['dist/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/admin', adminRoutes);
app.use('/api/kid', kidRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
