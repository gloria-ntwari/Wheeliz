"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', adminController_1.adminLogin);
// Publicly viewable by authenticated users (Admin or Kid)
router.get('/comics', authMiddleware_1.verifyAuth, adminController_1.getComics);
router.get('/comics/:id', authMiddleware_1.verifyAuth, adminController_1.getComicById);
// Protected routes (Admin Only)
router.use(authMiddleware_1.verifyAdmin);
/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', adminController_1.getDashboardStats);
/**
 * @swagger
 * /api/admin/comics:
 *   get:
 *     summary: Get all comics
 *     tags: [Comics]
 *   post:
 *     summary: Create a new comic
 *     tags: [Comics]
 */
const upload_1 = require("../middlewares/upload");
router.post('/comics', upload_1.uploadComicFiles, adminController_1.createComic);
/**
 * @swagger
 * /api/admin/comics/{id}:
 *   get:
 *     summary: Get a comic by ID
 *     tags: [Comics]
 *   put:
 *     summary: Update a comic
 *     tags: [Comics]
 *   delete:
 *     summary: Delete a comic
 *     tags: [Comics]
 */
router.put('/comics/:id', upload_1.uploadComicFiles, adminController_1.updateComic);
router.delete('/comics/:id', adminController_1.deleteComic);
/**
 * @swagger
 * /api/admin/kids:
 *   get:
 *     summary: Get all kids
 *     tags: [Kids]
 *     responses:
 *       200:
 *         description: List of kids retrieved successfully
 */
router.get('/kids', adminController_1.getAllKids);
router.post('/kids', upload_1.uploadAvatar, adminController_1.createKid);
router.get('/submissions', adminController_1.getSubmissions);
router.put('/profile', upload_1.uploadAvatar, adminController_1.updateAdminProfile);
exports.default = router;
