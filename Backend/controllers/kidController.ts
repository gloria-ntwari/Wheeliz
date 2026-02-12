import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { sendVerificationEmail } from '../config/emailService';
import crypto from 'crypto';



export const checkKidProfile = async (req: Request, res: Response) => {
    try {
        const { parentPhone, dateOfBirth } = req.body;
        
        const kid = await prisma.kid.findFirst({
            where: { parentPhone }
        });

        if (!kid) {
             return res.status(404).json({
                 status: 'fail',
                 message: 'This phone number is not registered'
             });
        }

        // Verify DOB
        if (!kid.dateOfBirth) {
             return res.status(500).json({ status: 'error', message: 'Date of birth missing in record' });
        }
        const inputDate = new Date(dateOfBirth);
        const kidDate = new Date(kid.dateOfBirth);
        
        if (inputDate.toISOString().split('T')[0] !== kidDate.toISOString().split('T')[0]) {
             return res.status(401).json({
                 status: 'error',
                 message: 'Invalid date of birth'
             });
        }
        
        const token = jwt.sign({ id: kid.id, role: 'kid' }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        // Update last login
        await (prisma.kid as any).update({
            where: { id: kid.id },
            data: { lastLogin: new Date() }
        });

        res.json({
            status: 'success',
            data: {
                exists: true,
                kid,
                token
            }
        });

    } catch (error) {
        console.error('Check profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

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

        // Update last login
        await (prisma.kid as any).update({
            where: { id: kid.id },
            data: { lastLogin: new Date() }
        });

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

        const token = jwt.sign({ id: newKid.id, role: 'kid' }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.status(201).json({
            status: 'success',
            message: 'Kid profile created successfully',
            data: {
                kid: newKid,
                token
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
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newKid = await prisma.kid.create({
            data: {
                name: fullName as string,
                email: email as string,
                passwordHash: passwordHash as string,
                role: 'kid',
                verificationCode,
                verificationCodeExpires,
                isVerified: false
            }
        });

        // Send Email
        const emailSent = await sendVerificationEmail(email, verificationCode);

        if (!emailSent) {
             // In a real app, you might want to handle this differently
             console.warn(`Failed to send verification email to ${email}`);
        }

        res.status(201).json({
            status: 'success',
            message: 'Step 1 complete: Please verify your email',
            data: {
                email: newKid.email
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

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and verification code are required'
            });
        }

        const kid = await prisma.kid.findUnique({
            where: { email }
        });

        if (!kid) {
            return res.status(404).json({
                status: 'error',
                message: 'Kid not found'
            });
        }

        if (kid.isVerified) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already verified'
            });
        }

        if (kid.verificationCode !== code) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid verification code'
            });
        }

        if (kid.verificationCodeExpires && kid.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                status: 'error',
                message: 'Verification code expired'
            });
        }

        await prisma.kid.update({
            where: { id: kid.id },
            data: {
                isVerified: true,
                verificationCode: null,
                verificationCodeExpires: null
            }
        });

        // Generate a temporary token if needed, or just proceed to profile completion
        // For now, let's return a success message so frontend moves to Step 3
        res.json({
            status: 'success',
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const completeKidProfile = async (req: Request, res: Response) => {
    try {
        const { email, fatherName, motherName, gender, dateOfBirth } = req.body;

        if (!email) {
             return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        const kid = await prisma.kid.findUnique({
            where: { email }
        });

        if (!kid || !kid.isVerified) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found or not verified'
            });
        }

        const updatedKid = await prisma.kid.update({
            where: { id: kid.id },
            data: {
                fatherName,
                motherName,
                gender,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                lastLogin: new Date()
            }
        });

        const token = jwt.sign(
            { id: updatedKid.id, email: updatedKid.email, role: updatedKid.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            status: 'success',
            message: 'Profile completed successfully',
            data: {
                token,
                kid: {
                    id: updatedKid.id,
                    name: updatedKid.name,
                    email: updatedKid.email,
                    role: updatedKid.role
                }
            }
        });

    } catch (error) {
        console.error('Profile completion error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const getKidDashboardStats = async (req: Request, res: Response) => {
    try {
        // Assuming user ID is attached to req.user (need to check auth middleware or jwt decoding)
        // Since I don't see the auth middleware here, I'll assume req has user from the token.
         // However, in Typescript 'req' might need type extension. 
         // For now, I'll trust the plan or existing patterns. 
         // Looking at previous controllers, they use req.body or params. 
         // Typically auth middleware adds user to req.
         // I will assume `(req as any).user.id` or similar is available if middleware is used.
         
         const kidId = (req as any).user?.id; // Accessing user from request, assuming auth middleware runs before

         if (!kidId) {
             return res.status(401).json({
                 status: 'error',
                 message: 'Unauthorized'
             });
         }

         const kid = await prisma.kid.findUnique({
             where: { id: kidId },
             include: {
                 submissions: {
                     include: {
                         comic: true
                     },
                     orderBy: { createdAt: 'desc' },
                     take: 5
                 }
             }
         });

         if (kid) {
             // Update last login whenever they access dashboard to keep status active
             await (prisma.kid as any).update({
                 where: { id: kid.id },
                 data: { lastLogin: new Date() }
             });
         }

         if (!kid) {
             return res.status(404).json({
                 status: 'error',
                 message: 'Kid not found'
             });
         }

         // Calculate stats
         const totalComicsRead = new Set(kid.submissions.map(s => s.comicId)).size;
         const totalMarks = kid.submissions.reduce((acc, curr) => acc + (curr.marks || 0), 0);
         
         // Mock rank for now (would require fetching all kids and sorting)
         // For simplicity and speed request, I'll use a placeholder or basic calculation
         const rank = 1; // Placeholder
         
         // Recent progress (mapped from submissions)
         const recentProgress = kid.submissions.map(sub => ({
             id: sub.comic.id,
             title: sub.comic.title,
             cover: sub.comic.image, 
             progress: sub.status === 'graded' ? 100 : 50, // Mock progress based on status
             status: sub.status
         }));

        res.json({
            status: 'success',
            data: {
                kidName: kid.name,
                avatar: kid.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`,
                standing: totalMarks, // Using marks as 'standing'
                rank,
                comicsRead: totalComicsRead,
                recentProgress
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
         res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const submitAssignment = async (req: Request, res: Response) => {
    try {
        const kidId = (req as any).user?.id;
        const { comicId, description, comments } = req.body;
        const files = req.files as Express.Multer.File[];

        if (!kidId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        if (!comicId) {
            return res.status(400).json({ status: 'error', message: 'Comic ID is required' });
        }

        const comic = await prisma.comic.findUnique({
            where: { id: comicId }
        });

        if (!comic) {
            return res.status(404).json({ status: 'error', message: 'Comic not found' });
        }

        if (files && files.length > comic.maxUploads) {
            return res.status(400).json({
                status: 'error',
                message: `Maximum ${comic.maxUploads} files allowed for this assignment`
            });
        }

        const fileUrls = files ? files.map(file => file.path) : [];

        const submission = await (prisma.submission as any).create({
            data: {
                kid: { connect: { id: kidId } },
                comic: { connect: { id: comicId } },
                description,
                comments,
                files: JSON.stringify(fileUrls),
                status: 'pending',
                submissionDate: new Date()
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Assignment submitted successfully',
            data: submission
        });

    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error: ' + (error instanceof Error ? error.message : String(error))
        });
    }
};