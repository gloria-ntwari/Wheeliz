import express from 'express';
import { 
  adminLogin, 
  getDashboardStats, 
  getComics, 
  createComic, 
  getComicById, 
  updateComic, 
  deleteComic,
  getAllKids
} from '../controllers/adminController';

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
import { uploadComicFiles } from '../middlewares/upload';

router.get('/comics', getComics);
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
router.get('/comics/:id', getComicById);
router.put('/comics/:id', updateComic);
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

export default router;