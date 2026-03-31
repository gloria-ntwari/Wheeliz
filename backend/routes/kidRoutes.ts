import type { Request, Response } from 'express';
import { kidLogin, createKid, kidSignup, getKidDashboardStats, checkKidProfile, verifyEmail, completeKidProfile, submitAssignment, getComicSubmissions, updateKidProfile, getKidNotifications, forgotPassword } from '../controllers/kidController';
import { setKidPassword } from '../controllers/adminController';

import { verifyKid } from '../middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

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
router.post('/check', checkKidProfile);

// Public: set password via email link (no auth required)
router.post('/set-password', setKidPassword);

// Public: request password reset link via email
router.post('/forgot-password', forgotPassword);

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
router.post('/create', createKid);

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
router.post('/signup', kidSignup);

/**
 * @swagger
 * /api/kid/verify-email:
 *   post:
 *     summary: Verify kid email with OTP
 *     tags: [Kid]
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /api/kid/complete-profile:
 *   post:
 *     summary: Complete kid profile details
 *     tags: [Kid]
 */
router.post('/complete-profile', completeKidProfile);

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
router.get('/dashboard', verifyKid, getKidDashboardStats);
router.get('/submissions/:comicId', verifyKid, getComicSubmissions);
router.get('/submissions/:comicId', verifyKid, getComicSubmissions);
import { uploadSubmissionFilesGCS, uploadAvatar } from '../middlewares/upload';
router.post('/submit', verifyKid, uploadSubmissionFilesGCS, submitAssignment);

/**
 * @swagger
 * /api/kid/profile:
 *   put:
 *     summary: Update kid profile
 *     tags: [Kid]
 */
router.put('/profile', verifyKid, uploadAvatar, updateKidProfile);
router.get('/notifications', verifyKid, getKidNotifications);

export default router;