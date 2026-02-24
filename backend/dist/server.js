"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const kidRoutes_1 = __importDefault(require("./routes/kidRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : [
        'http://localhost:5173',
        'https://wheeliz-web.vercel.app',
        'https://wheeliz-production.up.railway.app'
    ];
const corsOptions = {
    origin: function (origin, callback) {
        console.log("Incoming origin:", origin); // DEBUG
        // allow requests without origin (Postman, server-to-server)
        if (!origin)
            return callback(null, true);
        // allow localhost automatically
        if (origin.startsWith("http://localhost")) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Blocked origin:", origin);
            callback(new Error("CORS blocked: " + origin));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// ✅ IMPORTANT: CORS MUST BE FIRST
app.use((0, cors_1.default)(corsOptions));
// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// ✅ Handle preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// Body parser AFTER cors
app.use(express_1.default.json());
// Serve uploaded files statically
// Serve uploaded files statically
const uploadsPath = path_1.default.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../uploads' : './uploads');
console.log('Serving uploads from:', uploadsPath);
app.use('/uploads', (req, res, next) => {
    console.log(`Static file request: ${req.method} ${req.url}`);
    next();
}, express_1.default.static(uploadsPath));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Routes
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/kid', kidRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
