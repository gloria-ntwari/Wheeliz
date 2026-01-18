import express from 'express';
import { kidLogin, createKid } from '../controllers/kidController';

const router = express.Router();

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
router.post('/check', kidLogin);

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

export default router;