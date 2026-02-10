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



const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [
      'http://localhost:5173',
      'https://wheeliz-web.vercel.app',
      'https://wheeliz-production.up.railway.app'
    ];



const corsOptions = {
  origin: function (origin: any, callback: any) {

    console.log("Incoming origin:", origin); // DEBUG

    // allow requests without origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // allow localhost automatically
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};


// ✅ IMPORTANT: CORS MUST BE FIRST
app.use(cors(corsOptions));

// ✅ Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser AFTER cors
app.use(express.json());


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Root route
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


// Swagger setup
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


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/kid', kidRoutes);
app.use('/api/auth', authRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
