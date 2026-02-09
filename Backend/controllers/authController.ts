import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

/**
 * Unified login for both Admins and Kids
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // 1. Try to find user in Admin table
        let user: any = await prisma.admin.findUnique({
            where: { email }
        });

        let role = 'admin';

        // 2. If not found in Admin, try Kid table
        if (!user) {
            user = await prisma.kid.findUnique({
                where: { email }
            });
            role = 'kid';
        }

        // 3. If still not found, unauthorized
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash as string);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // 5. Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role || role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Update last login if user is a kid
        if (role === 'kid') {
            await (prisma.kid as any).update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });
        }

        // 6. Return response with user data and role
        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || role
                }
            }
        });

    } catch (error) {
        console.error('Unified login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
