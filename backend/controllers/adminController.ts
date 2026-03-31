import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { sendPasswordSetupEmail } from '../config/emailService';
import { uploadToGCS } from '../config/gcs';

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar
        }
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error'
    });
  }
};


// Get Notification Stats
export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const pendingCount = await prisma.submission.count({
      where: { status: 'pending' }
    });

    res.json({
      status: 'success',
      data: {
        pendingCount
      }
    });
  } catch (error) {
    
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
};

// Get Dashboard Statistics
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [totalComics, totalSubmissions, totalKids, totalAdmins] = await Promise.all([
      prisma.comic.count(),
      prisma.submission.count(),
      prisma.kid.count(),
      prisma.admin.count()
    ]);

    // Greeting logic
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';

    // Chart Data Logic for the last 12 months
    const now = new Date();
    // Chart Data Container
    const monthlyData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    const currentYear = now.getFullYear();

    for (let i = 0; i < 12; i++) {
        const monthName = months[i];
        
        // Define start and end of the month in UTC to ensure consistency
        // Using UTC 00:00:00.000 for start
        const startOfMonth = new Date(Date.UTC(currentYear, i, 1));
        // Using UTC 23:59:59.999 for end of month
        const endOfMonth = new Date(Date.UTC(currentYear, i + 1, 0, 23, 59, 59, 999));


        if (startOfMonth > now) {
             monthlyData.push({ month: monthName, active: 0, offline: 0 });
             continue;
        }

        
        const totalAtMonth = await prisma.kid.count({
            where: {
                createdAt: {
                    lte: endOfMonth
                }
            }
        });

        // For the current month, we define Active as "Logged in since start of month"
        let activeCount = 0;
        if (i === now.getMonth()) {
             activeCount = await prisma.kid.count({
                where: {
                    lastLogin: {
                        gte: startOfMonth
                    }
                }
             });
        } else {

             
             activeCount = await prisma.kid.count({
                 where: {
                     lastLogin: {
                         gte: startOfMonth,
                         lte: endOfMonth
                     }
                 }
             });

        }

        const offline = Math.max(0, totalAtMonth - activeCount);
        // console.log(`[Stats Debug] Month: ${monthName}, Start: ${startOfMonth.toISOString()}, End: ${endOfMonth.toISOString()}, Total: ${totalAtMonth}, Active: ${activeCount}`);
        monthlyData.push({ month: monthName, active: activeCount, offline });
    }

    // --- Weekly Data (Current Month's Weeks) ---
    const weeklyData = [];
    const currentYearW = now.getFullYear();
    const currentMonthW = now.getMonth();

    for (let i = 1; i <= 4; i++) {
        const startDay = (i - 1) * 7 + 1;
        
        // Start of week
        const startOfWeek = new Date(currentYearW, currentMonthW, startDay);
        startOfWeek.setHours(0, 0, 0, 0);

        // End of week
        let endOfWeek;
        if (i === 4) {
             // Last week goes until end of month (e.g. 28th, 30th, 31st)
             endOfWeek = new Date(currentYearW, currentMonthW + 1, 0);
        } else {
             endOfWeek = new Date(currentYearW, currentMonthW, startDay + 6);
        }
        endOfWeek.setHours(23, 59, 59, 999);

        // If the start of the week is in the future, display 0 stats
        if (startOfWeek > now) {
             weeklyData.push({ label: `Week ${i}`, active: 0, offline: 0 });
             continue;
        }

        const totalAtWeek = await prisma.kid.count({
            where: { createdAt: { lte: endOfWeek } }
        });

        const activeCount = await prisma.kid.count({
            where: { lastLogin: { gte: startOfWeek, lte: endOfWeek } }
        });

        const offline = Math.max(0, totalAtWeek - activeCount);
        weeklyData.push({ label: `Week ${i}`, active: activeCount, offline });
    }

    // --- Daily Data (Last 7 Days) ---
    const dailyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        
        const startOfDay = new Date(d);
        const endOfDay = new Date(d);
        endOfDay.setHours(23, 59, 59, 999);

        const dayLabel = days[d.getDay()];

        const totalAtDay = await prisma.kid.count({
            where: { createdAt: { lte: endOfDay } }
        });

        const activeCount = await prisma.kid.count({
            where: { lastLogin: { gte: startOfDay, lte: endOfDay } }
        });

        const offline = Math.max(0, totalAtDay - activeCount);
        dailyData.push({ label: dayLabel, active: activeCount, offline });
    }
    
    // Construct final response structure
    const chartData = {
        monthly: monthlyData,
        weekly: weeklyData,
        daily: dailyData
    };


    res.json({
      status: 'success',
      data: {
        totalComics,
        totalSubmissions,
        totalKids,
        totalAdmins,
        greeting,
        chartData // Sending the calculated chart data
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Create Comic
export const createComic = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;

    // Handle file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log('CreateComic Controller - Files received:', files);
    console.log('CreateComic Controller - Body received:', req.body);
    
    let coverImage = '';
    let documentPath = '';

    if (files?.coverImage?.[0]) {
      const file = files.coverImage[0];
      const fileName = `comics/${Date.now()}-${file.originalname}`;
      coverImage = await uploadToGCS(file.buffer, fileName, file.mimetype);
    }

    // Handle document upload (multiple documents support)
    if (files?.documents && files.documents.length > 0) {
      const uploadPromises = files.documents.map(async (doc) => {
        const fileName = `documents/${Date.now()}-${doc.originalname}`;
        return await uploadToGCS(doc.buffer, fileName, doc.mimetype);
      });
      const paths = await Promise.all(uploadPromises);
      documentPath = JSON.stringify(paths);
    }

    if (!title || !subtitle || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, subtitle, and description are required'
      });
    }

    const comic = await (prisma.comic as any).create({
      data: {
        title,
        subtitle,
        description,
        image: coverImage,
        category: category || null,
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
        bonus: bonus ? parseInt(bonus) : 0,
        totalMarks: totalMarks ? parseInt(totalMarks) : 0,
        maxUploads: maxUploads ? parseInt(maxUploads) : 1,
        document: documentPath || null,
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Comic created successfully',
      data: comic
    });
  } catch (error) {
    console.error('Create comic error detail:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error'
    });
  }
};

// Get All Comics
export const getComics = async (_req: Request, res: Response) => {
  try {
    const comics = await prisma.comic.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get total kids count for progress calculation
    const totalKids = await prisma.kid.count();

    // Transform comics to include submission count
    const comicsWithStats = comics.map(comic => ({
      ...comic,
      submissionCount: comic._count.submissions,
      totalKids
    }));

    res.json({
      status: 'success',
      data: comicsWithStats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get Single Comic
export const getComicById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comic = await prisma.comic.findUnique({
      where: { id: id as string }
    });

    if (!comic) {
      return res.status(404).json({
        status: 'error',
        message: 'Comic not found'
      });
    }

    res.json({
      status: 'success',
      data: comic
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update Comic
export const updateComic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Update Comic Request Body:', req.body);
    // console.log('Update Comic Request Files:', req.files); // Optional logging

    const { title, subtitle, description, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;

    // Handle file uploads for update
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let coverImage = undefined;
    let documentPath = undefined;

    if (files?.coverImage?.[0]) {
      const file = files.coverImage[0];
      const fileName = `comics/${Date.now()}-${file.originalname}`;
      coverImage = await uploadToGCS(file.buffer, fileName, file.mimetype);
    }

    if (files?.documents && files.documents.length > 0) {
      const uploadPromises = files.documents.map(async (doc) => {
        const fileName = `documents/${Date.now()}-${doc.originalname}`;
        return await uploadToGCS(doc.buffer, fileName, doc.mimetype);
      });
      const paths = await Promise.all(uploadPromises);
      documentPath = JSON.stringify(paths);
    }

    const dataToUpdate: any = {};


    if (title !== undefined) dataToUpdate.title = title;
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle;
    if (description !== undefined) dataToUpdate.description = description; 
    if (category !== undefined) dataToUpdate.category = category;

    // Update Date field
    if (submissionDeadline) {
      const parsedDate = new Date(submissionDeadline);
      if (!isNaN(parsedDate.getTime())) {
        dataToUpdate.submissionDeadline = parsedDate;
      }
    }

    // Update Int fields - handle "0" correctly
    if (bonus !== undefined && bonus !== '') {
      const parsed = parseInt(String(bonus), 10);
      if (!isNaN(parsed)) dataToUpdate.bonus = parsed;
    }

    if (totalMarks !== undefined && totalMarks !== '') {
      const parsed = parseInt(String(totalMarks), 10);
      if (!isNaN(parsed)) dataToUpdate.totalMarks = parsed;
    }

    if (maxUploads !== undefined && maxUploads !== '') {
      const parsed = parseInt(String(maxUploads), 10);
      if (!isNaN(parsed)) dataToUpdate.maxUploads = parsed;
    }

    if (coverImage) {
      dataToUpdate.image = coverImage;
    }

    if (documentPath) {
      dataToUpdate.document = documentPath;
    }

    // Use 'as any' to bypass potential type mismatch if generated client is outdated
    const comic = await (prisma.comic as any).update({
      where: { id: id as string },
      data: dataToUpdate
    });

    res.json({
      status: 'success',
      message: 'Comic updated successfully',
      data: comic
    });
  } catch (error) {
    console.error('Error updating comic:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error: ' + (error instanceof Error ? error.message : String(error))
    });
  }
};

// Delete Comic
export const deleteComic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete related submissions first (Cascading delete)
    await prisma.submission.deleteMany({
      where: { comicId: id as string }
    });

    await prisma.comic.delete({
      where: { id: id as string }
    });
    res.json({
      status: 'success',
      message: 'Comic deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Create Kid (Admin functionality)
export const createKid = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      gender, 
      fatherName, 
      motherName, 
      dateOfBirth, 
      parentPhone,
    } = req.body;

    if (!name || !parentPhone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and Parent Phone are required'
      });
    }

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required to send the password setup link'
      });
    }

    // Handle avatar upload if any
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let avatar = '';
    if (files?.avatar?.[0]) {
      avatar = files.avatar[0].path;
    }

    // Generate a secure setup token (24h expiry)
    const crypto = require('crypto');
    const setupToken = crypto.randomBytes(32).toString('hex');
    const setupTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const kid = await prisma.kid.create({
      data: {
        name,
        email,
        gender,
        fatherName,
        motherName,
        parentPhone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        passwordHash: null, // No password until kid sets it
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        verificationCode: setupToken,
        verificationCodeExpires: setupTokenExpires,
      }
    });

    // Send password setup email
    const frontendUrl = process.env.FRONT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
    const setupLink = `${frontendUrl}/set-password?token=${setupToken}&email=${encodeURIComponent(email)}`;

    const emailSent = await sendPasswordSetupEmail(email, name, setupLink);
    if (!emailSent) {
      console.warn(`[CreateKid] Failed to send setup email to ${email}`);
    }

    res.status(201).json({
      status: 'success',
      message: `Kid created successfully. A password setup link has been sent to ${email}.`,
      data: kid
    });
  } catch (error: any) {
    console.error('Create kid error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'error',
        message: 'Email or Parent Phone already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update Kid
export const updateKid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      gender, 
      fatherName, 
      motherName, 
      dateOfBirth, 
      parentPhone,
      status
    } = req.body;

    const dataToUpdate: any = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (gender !== undefined) dataToUpdate.gender = gender;
    if (fatherName !== undefined) dataToUpdate.fatherName = fatherName;
    if (motherName !== undefined) dataToUpdate.motherName = motherName;
    if (parentPhone !== undefined) dataToUpdate.parentPhone = parentPhone;
    
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (!isNaN(parsedDate.getTime())) {
        dataToUpdate.dateOfBirth = parsedDate;
      }
    }

    // Handle lastLogin logic if status is passed to manually toggle if needed, 
    // but usually status is derived from lastLogin in getAllKids.
    // However, the frontend Edit modal has a 'status' field.
    // Let's check how we want to handle 'Status' from the form.
    // If we want to persist it, we might need a status field in the schema (which it doesn't have).
    // The schema does NOT have a status field. It derives it.
    // So we ignore 'status' in dataToUpdate for now as it's not in the model.

    // Handle avatar upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files?.avatar?.[0]) {
      dataToUpdate.avatar = files.avatar[0].path;
    }

    const kid = await prisma.kid.update({
      where: { id: id as string },
      data: dataToUpdate
    });

    res.json({
      status: 'success',
      message: 'Kid updated successfully',
      data: kid
    });
  } catch (error: any) {
    console.error('Update kid error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'error',
        message: 'Email or Parent Phone already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Delete Kid
export const deleteKid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete related submissions first (Prisma doesn't have cascade delete configured in the schema for Kid)
    await prisma.submission.deleteMany({
      where: { kidId: id as string }
    });

    // Use deleteMany to avoid P2025 if the record is already gone
    const deleteResult = await prisma.kid.deleteMany({
      where: { id: id as string }
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Kid not found or already deleted'
      });
    }

    res.json({
      status: 'success',
      message: 'Kid deleted successfully'
    });
  } catch (error) {
    console.error('Delete kid error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Set Kid Password (via email setup link)
export const setKidPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ status: 'error', message: 'Email, token, and password are required' });
    }

    const kid = await prisma.kid.findUnique({ where: { email } });

    if (!kid) {
      return res.status(404).json({ status: 'error', message: 'Account not found' });
    }

    if (kid.verificationCode !== token) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired setup link' });
    }

    if (kid.verificationCodeExpires && kid.verificationCodeExpires < new Date()) {
      return res.status(400).json({ status: 'error', message: 'This setup link has expired. Please contact an admin.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.kid.update({
      where: { id: kid.id },
      data: {
        passwordHash: hashedPassword,
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      }
    });

    res.json({
      status: 'success',
      message: 'Password set successfully! You can now log in.'
    });
  } catch (error) {
    console.error('Set kid password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Get All Kids
export const getAllKids = async (req: Request, res: Response) => {
  try {
    const [kids, comics] = await Promise.all([
      (prisma.kid as any).findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          gender: true,
          fatherName: true,
          motherName: true,
          dateOfBirth: true,
          lastLogin: true,
          createdAt: true,
          submissions: {
            select: {
              marks: true,
              comicId: true,
              createdAt: true
            }
          }
        }
      }),
      prisma.comic.findMany({
        select: {
          id: true,
          bonus: true,
          submissionDeadline: true
        }
      })
    ]);

    // Calculate 7 days ago (start of day) for active status
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // First pass: calculate points and comics for each kid
    const kidsWithPoints = kids.map((kid: any) => {
      let totalPoints = 0;
      const uniqueComics = new Set();

      kid.submissions?.forEach((sub: any) => {
        // Marks
        totalPoints += (sub.marks || 0);
        
        // Bonus points
        const comic = comics.find(c => c.id === sub.comicId);
        if (comic && comic.bonus && comic.submissionDeadline) {
          if (new Date(sub.createdAt) <= new Date(comic.submissionDeadline)) {
            totalPoints += comic.bonus;
          }
        }

        // Track unique comics
        uniqueComics.add(sub.comicId);
      });

      return {
        ...kid,
        totalPoints,
        comicsCount: uniqueComics.size
      };
    });

    // Sort by totalPoints to determine ranks
    const sortedByPoints = [...kidsWithPoints].sort((a, b) => b.totalPoints - a.totalPoints);

    // Final transformation
    const formattedKids = kidsWithPoints.map((kid: any) => {
      const isActive = kid.lastLogin ? new Date(kid.lastLogin) >= sevenDaysAgo : false;
      const rank = sortedByPoints.findIndex(k => k.id === kid.id) + 1;

      return {
        ...kid,
        status: isActive ? 'Active' : 'Inactive',
        avatar: kid.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`,
        comicsRead: comics.length, // Total number of comics in the system
        rank: rank,
        submissions: kid.submissions?.length || 0
      };
    });

    res.json({
      status: 'success',
      data: formattedKids
    });
  } catch (error) {
    console.error('Error fetching kids:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get All Submissions
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        kid: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        },
        comic: {
          select: {
            id: true,
            title: true,
            image: true,
            subtitle: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id;
    if (!adminId) {
      console.error('[Admin Update] Unauthorized: No adminId in request');
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    console.log(`[Admin Update] Attempting to update admin profile for ID: ${adminId}`);

    const { name, email, oldPassword, newPassword } = req.body;
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({ where: { id: adminId } });
    console.log(`[Admin Update] Database check for ID ${adminId}: ${existingAdmin ? 'Found' : 'NOT FOUND'}`);

    if (!existingAdmin) {
      console.error(`[Admin Update] Admin with ID ${adminId} not found in database.`);
      return res.status(404).json({ 
        status: 'error', 
        message: 'Admin record not found. Please log out and log back in to refresh your session.' 
      });
    }

    const dataToUpdate: any = {};

    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;

    // Handle avatar upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files?.avatar?.[0]) {
      dataToUpdate.avatar = files.avatar[0].path;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ status: 'error', message: 'Old password is required to set a new one' });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, existingAdmin.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ status: 'error', message: 'Invalid old password' });
      }

      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: dataToUpdate
    });

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        avatar: updatedAdmin.avatar
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
// Grade Submission
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { marks } = req.body;

    if (marks === undefined) {
      return res.status(400).json({ status: 'error', message: 'Marks are required' });
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId as string },
      data: {
        marks: parseInt(marks as string),
        status: 'graded'
      }
    });

    res.json({
      status: 'success',
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

import cloudinary from '../config/cloudinary';
import AdmZip from 'adm-zip';
import https from 'https';

// Download Submission File (Proxy to bypass Cloudinary PDF restrictions)
// Uses Cloudinary's generate_archive API (the ONLY method that bypasses PDF delivery restrictions),
// then extracts the raw PDF from the zip on the server and sends it directly to the browser.
export const downloadSubmissionFile = async (req: Request, res: Response) => {
  try {
    let fileUrl = req.query.url as string;
    if (!fileUrl) {
      return res.status(400).json({ status: 'error', message: 'File URL is required' });
    }

    // If it's not a Cloudinary URL, just redirect
    if (!fileUrl.includes('cloudinary.com')) {
      return res.redirect(fileUrl);
    }

    // Strip fl_attachment if present
    fileUrl = fileUrl.replace('/upload/fl_attachment/', '/upload/');

    // Extract public ID from the Cloudinary URL
    const parts = fileUrl.split('/upload/');
    if (parts.length < 2) {
      return res.status(400).json({ status: 'error', message: 'Invalid Cloudinary URL' });
    }

    const pathPart = parts[1];
    let publicId = pathPart.replace(/^v\d+\//, '');
    const lastDotIndex = publicId.lastIndexOf('.');
    let originalExtension = '';
    if (lastDotIndex > -1) {
      originalExtension = publicId.substring(lastDotIndex + 1);
      publicId = publicId.substring(0, lastDotIndex);
    }

    console.log('[Download Proxy] Public ID:', publicId, 'Extension:', originalExtension);

    // Fetch via Cloudinary's generate_archive API
    const archiveUrl = cloudinary.utils.download_zip_url({
      public_ids: [publicId],
      resource_type: 'image',
      target_format: 'zip'
    });

    console.log('[Download Proxy] Fetching archive natively...');
    
    // Use native https to ensure no fetch stream freezes
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      https.get(archiveUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Cloudinary returned status: ${response.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    });

    console.log(`[Download Proxy] Buffer size: ${zipBuffer.byteLength} bytes. Parsing zip...`);
    
    let zipEntries;
    let zip;
    try {
      zip = new (AdmZip as any)(zipBuffer);
      zipEntries = zip.getEntries();
    } catch (e: any) {
      console.error('[Download Proxy] AdmZip threw an error:', e.message);
      return res.status(500).json({ status: 'error', message: 'Failed to extract zip' });
    }

    console.log(`[Download Proxy] Found ${zipEntries.length} entries in zip.`);

    // Find the PDF entry inside the zip (or fallback to first entry)
    const pdfEntry = zipEntries.find((entry: any) =>
      entry.entryName.toLowerCase().endsWith('.pdf')
    ) || zipEntries[0];

    if (!pdfEntry) {
      console.error('[Download Proxy] No file found in archive');
      return res.status(404).json({ status: 'error', message: 'No file found in archive' });
    }

    let pdfBuffer;
    try {
      pdfBuffer = pdfEntry.getData();
    } catch (e: any) {
      console.error('[Download Proxy] pdfEntry.getData() threw an error:', e.message);
      return res.status(500).json({ status: 'error', message: 'Failed to extract PDF data' });
    }

    const baseName = publicId.split('/').pop() || 'submission';
    const fileName = `${baseName}.${originalExtension || 'pdf'}`;

    console.log(`[Download Proxy] Extracted "${pdfEntry.entryName}" (${pdfBuffer.length} bytes), sending as "${fileName}"`);

    // Send the raw PDF — Content-Disposition: attachment forces the browser to download the file directly
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    
    // Required headers for iframes sometimes
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.send(pdfBuffer);

  } catch (error: any) {
    console.error('Download proxy top-level error:', error.message || error);
    res.status(500).json({ status: 'error', message: 'Server error generating download link' });
  }
};