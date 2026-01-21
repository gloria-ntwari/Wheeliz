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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
// CORS configuration - allow frontend URL from environment or default to localhost
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:5173'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/kid', kidRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map