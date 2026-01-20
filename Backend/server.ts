import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import kidRoutes from './routes/kidRoutes';
import adminRoutes from './routes/adminRoutes';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS configuration - allow frontend URL from environment or default to localhost
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// Root route to prevent 404
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
    servers: [{
      url: process.env.API_URL || `http://localhost:${PORT}`
    }],
  },
  apis: ['./routes/*.ts', './dist/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/admin', adminRoutes);
app.use('/api/kid', kidRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});   