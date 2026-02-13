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
        const kidId = (req as any).user?.id;

         if (!kidId) {
             return res.status(401).json({
                 status: 'error',
                 message: 'Unauthorized'
             });
         }

         // Fetch all comics to calculate total possible marks (Global Denominator)
         const allComics = await prisma.comic.findMany();
         const grandTotalMarks = allComics.reduce((acc, c) => acc + (c.totalMarks || 0), 0);
         
         // Fetch all kids with their submissions to calculate rankings
         const allKids = await prisma.kid.findMany({
             include: {
                 submissions: {
                     include: { comic: true }
                 }
             }
         });

         // Calculate Score for every kid
         // Score = Sum(Marks) + Sum(Bonus if submitted before deadline)
         const kidScores = allKids.map(k => {
             let totalScore = 0;
             k.submissions.forEach(sub => {
                 const marks = sub.marks || 0;
                 let bonus = 0;
                 if (sub.comic && sub.comic.bonus && sub.comic.submissionDeadline) {
                     if (new Date(sub.createdAt) <= new Date(sub.comic.submissionDeadline)) {
                         bonus = sub.comic.bonus;
                     }
                 }
                 totalScore += marks + bonus;
             });
             return { kidId: k.id, score: totalScore, kidData: k };
         });

         // Sort by Score Descending
         kidScores.sort((a, b) => b.score - a.score);

         // Find Current Kid's Rank and Data
         const myRankIndex = kidScores.findIndex(k => k.kidId === kidId);
         
         if (myRankIndex === -1) {
             return res.status(404).json({ status: 'error', message: 'Kid not found in records' });
         }

         const myData = kidScores[myRankIndex];
         const rank = myRankIndex + 1;
         const myTotalScore = myData.score;

         // Calculate Overall Percentage based on Grand Total Marks
         // If grandTotalMarks is 0, avoid division by zero
         const overallPercentageRaw = grandTotalMarks > 0 
            ? (myTotalScore / grandTotalMarks) * 100 
            : 0;
         
         // Format to 2 decimal places
         const overallPercentage = Number(overallPercentageRaw.toFixed(2));

         // Update last login
         if (myData.kidData) {
             await (prisma.kid as any).update({
                 where: { id: kidId },
                 data: { lastLogin: new Date() }
             });
         }

         // Prepare Recent Progress (using specific submission marks / comic total marks)
         // We need to re-fetch or use the data we already have. 
         // The `allKids` query included submissions, but not sorted or limited.
         // Let's rely on the sorted `kidScores` finding, but `allKids` has all submissions.
         // Effectively `myData.kidData.submissions`.
         
         const mySubmissions = myData.kidData.submissions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Recent first

         const recentProgress = mySubmissions.map(sub => {
             const maxMarks = sub.comic.totalMarks || 100;
             const obtained = sub.marks || 0;
             // For individual assignment progress, we usually just show Marks/Total ignoring bonus in the bar,
             // or do we include bonus? Usually "Marks from Submissions" implies just the grade.
             // If the user wants consistent "%" everywhere, let's stick to Grade/Total.
             // Bonus is usually an "extra" on top or part of the "Overall Rank".
             // Let's keep individual bars as Grade/Total for clarity unless asked otherwise.
             
             const percentageRaw = maxMarks > 0 ? (obtained / maxMarks) * 100 : 0;
             const percentage = Number(percentageRaw.toFixed(2));
             
             return {
                id: sub.comic.id,
                title: sub.comic.title,
                cover: sub.comic.image, 
                progress: percentage, 
                status: sub.status,
                submissionDate: sub.submissionDate,
                marks: obtained,
                totalMarks: maxMarks
             };
         });
         
         const totalComicsRead = new Set(mySubmissions.map(s => s.comicId)).size;

        res.json({
            status: 'success',
            data: {
                kidName: myData.kidData.name,
                email: myData.kidData.email,
                avatar: myData.kidData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(myData.kidData.name)}&background=random`,
                parentPhone: myData.kidData.parentPhone,
                dateOfBirth: myData.kidData.dateOfBirth,
                standing: rank, 
                overallPercentage, 
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

        // Check for existing submission
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                kidId,
                comicId
            }
        });

        if (existingSubmission) {
            return res.status(400).json({
                status: 'error',
                message: 'You have already submitted for this comic.'
            });
        }

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

export const getComicSubmissions = async (req: Request, res: Response) => {
    try {
        const kidId = (req as any).user?.id;
        const comicId = req.params.comicId as string;

        if (!kidId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const submissions = await prisma.submission.findMany({
            where: {
                kidId,
                comicId
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            status: 'success',
            data: submissions
        });
    } catch (error) {
        console.error('Get comic submissions error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

export const updateKidProfile = async (req: Request, res: Response) => {
    try {
        const kidId = (req as any).user?.id;
        if (!kidId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const { name, email, parentPhone, dateOfBirth, oldPassword, newPassword } = req.body;
        
        const existingKid = await prisma.kid.findUnique({ where: { id: kidId } });
        if (!existingKid) {
            return res.status(404).json({ status: 'error', message: 'Kid not found' });
        }

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (parentPhone) dataToUpdate.parentPhone = parentPhone;
        if (dateOfBirth) dataToUpdate.dateOfBirth = new Date(dateOfBirth);

        // Handle avatar upload
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files?.avatar?.[0]) {
            dataToUpdate.avatar = files.avatar[0].path;
        }

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ status: 'error', message: 'Old password is required' });
            }
            if (!existingKid.passwordHash) {
                 return res.status(400).json({ status: 'error', message: 'No password set for this account' });
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, existingKid.passwordHash);
            if (!isPasswordValid) {
                return res.status(401).json({ status: 'error', message: 'Invalid old password' });
            }
            dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
        }

        const updatedKid = await prisma.kid.update({
            where: { id: kidId },
            data: dataToUpdate
        });

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                kidName: updatedKid.name,
                avatar: updatedKid.avatar,
                email: updatedKid.email
            }
        });

    } catch (error) {
        console.error('Update kid profile error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};