"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }
        // Find admin
        const admin = await prisma_1.default.admin.findUnique({
            where: { email }
        });
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.adminLogin = adminLogin;
//# sourceMappingURL=adminController.js.map