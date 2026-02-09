"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kidController_1 = require("../controllers/kidController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/kid/check:
 *   post:
 *     summary: Check kid by phone and DOB
 *     tags: [Kid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentPhone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Success or confirmation needed
 */
router.post('/check', kidController_1.checkKidProfile);
/**
 * @swagger
 * /api/kid/create:
 *   post:
 *     summary: Create new kid profile
 *     tags: [Kid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentPhone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               confirm:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Profile created
 */
router.post('/create', kidController_1.createKid);
/**
 * @swagger
 * /api/kid/signup:
 *   post:
 *     summary: Kid signup
 *     tags: [Kid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 */
router.post('/signup', kidController_1.kidSignup);
/**
 * @swagger
 * /api/kid/dashboard:
 *   get:
 *     summary: Get kid dashboard stats
 *     tags: [Kid]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard', authMiddleware_1.verifyKid, kidController_1.getKidDashboardStats);
exports.default = router;
