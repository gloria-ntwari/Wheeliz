import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

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
    res.status(500).json({
      status: 'error',
      message: 'Server error'
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
    res.status(500).json({ status: 'error', message: 'Server error' });
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
      coverImage = files.coverImage[0].path;
    }

    // Handle document upload (multiple documents support)
    if (files?.documents && files.documents.length > 0) {
      const paths = files.documents.map(doc => doc.path);
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
    console.error('Create comic error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
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
      coverImage = files.coverImage[0].path;
    }

    if (files?.documents && files.documents.length > 0) {
      const paths = files.documents.map(doc => doc.path);
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
      password 
    } = req.body;

    if (!name || !parentPhone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and Parent Phone are required'
      });
    }

    // Handle avatar upload if any
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let avatar = '';
    if (files?.avatar?.[0]) {
      avatar = files.avatar[0].path;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const kid = await prisma.kid.create({
      data: {
        name,
        email,
        gender,
        fatherName,
        motherName,
        parentPhone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        passwordHash: hashedPassword,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Kid created successfully',
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

// Get All Kids
export const getAllKids = async (req: Request, res: Response) => {
  try {
    const kids = await (prisma.kid as any).findMany({
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
        _count: {
          select: {
            submissions: true,
          }
        }
      }
    });

    // Calculate 7 days ago (start of day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Transform data
    const formattedKids = kids.map((kid: any) => {
      // Determine active status: true if lastLogin >= sevenDaysAgo
      const isActive = kid.lastLogin ? new Date(kid.lastLogin) >= sevenDaysAgo : false;

      return {
        ...kid,
        status: isActive ? 'Active' : 'Inactive',
        // Use uploaded avatar if exists, otherwise generate placeholder
        avatar: kid.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`,
        comicsRead: 0, // Placeholder
        rank: 0,       // Placeholder
        submissions: kid._count.submissions
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