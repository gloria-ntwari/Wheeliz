import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Unified login for Admins and Kids
 *     tags: [Auth]
 */
router.post('/login', login);

export default router;
