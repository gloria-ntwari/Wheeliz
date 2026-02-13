import express from 'express';
import { 
  adminLogin, 
  getDashboardStats, 
  getComics, 
  createComic, 
  getComicById, 
  updateComic, 
  deleteComic,
  getAllKids,
  createKid,
  updateAdminProfile,
  getSubmissions,
  gradeSubmission,
  getNotifications
} from '../controllers/adminController';
import { verifyAdmin, verifyAuth } from '../middlewares/authMiddleware';

const router = express.Router();

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
router.post('/login', adminLogin);

// Publicly viewable by authenticated users (Admin or Kid)
router.get('/comics', verifyAuth, getComics);
router.get('/comics/:id', verifyAuth, getComicById);

// Protected routes (Admin Only)
router.use(verifyAdmin);

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
router.get('/stats', getDashboardStats);

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
import { uploadComicFiles, uploadAvatar } from '../middlewares/upload';

router.post('/comics', uploadComicFiles, createComic);

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
router.put('/comics/:id', uploadComicFiles, updateComic);
router.delete('/comics/:id', deleteComic);

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
router.get('/kids', getAllKids);
router.post('/kids', uploadAvatar, createKid);
router.post('/kids', uploadAvatar, createKid);
router.get('/notifications', getNotifications);
router.get('/submissions', getSubmissions);
router.post('/submissions/:submissionId/grade', gradeSubmission);
router.put('/profile', uploadAvatar, updateAdminProfile);

export default router;