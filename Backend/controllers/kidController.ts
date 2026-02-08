import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';


export const kidLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        const kid = await prisma.kid.findUnique({
            where: { email }
        });
        
        if (!kid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, kid.passwordHash as string);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: kid.id, email: kid.email, role: kid.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                kid: {
                    id: kid.id,
                    name: kid.name,
                    email: kid.email,
                    role: kid.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
}


export const createKid = async (req: Request, res: Response) => {
    try {
        const { name, parentPhone, dateOfBirth, confirm } = req.body;

        if (!confirm) {
            return res.status(400).json({
                status: 'error',
                message: 'Profile creation must be confirmed'
            });
        }

        if(!name || !parentPhone || !dateOfBirth) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, parent phone, and date of birth are required'
            });
        }

        const existingKid = await prisma.kid.findUnique({
            where: { parentPhone }
        });

        if (existingKid) {
            return res.status(409).json({
                status: 'error',
                message: 'A profile with this parent phone already exists'
            });
        }

        const newKid = await prisma.kid.create({
            data: {
                name: name as string,
                parentPhone: parentPhone as string,
                dateOfBirth: new Date(dateOfBirth)
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Kid profile created successfully',    
            data: {
                kid:{
                    id: newKid.id,
                    name: newKid.name,
                    parentPhone: newKid.parentPhone,
                    dateOfBirth: newKid.dateOfBirth
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const kidSignup = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Full name, email, and password are required'
            });
        }

        const existingKid = await prisma.kid.findUnique({
            where: { email }
           
        });

        if (existingKid) {
            return res.status(409).json({
                status: 'error',
                message: 'A kid with this email already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newKid = await prisma.kid.create({
            data: {
                name: fullName as string,
                email: email as string,
                passwordHash: passwordHash as string,
                role: 'kid'
            }
        });

        const token = jwt.sign(
            { id: newKid.id, email: newKid.email, role: newKid.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Kid registered successfully',
            data: {
                token,
                kid: {
                    id: newKid.id,
                    name: newKid.name,
                    email: newKid.email,
                    role: newKid.role
                }
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};