"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKid = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }
        req.admin = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyKid = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'kid') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};
exports.verifyKid = verifyKid;
