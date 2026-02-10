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
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
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
             // For past months, we can't know. Let's assume 0 active? Or mock it?
             // If we return 0 active for Jan-Sept, the graph looks broken.
             // If we just approximate it based on the current ratio?
             // Users usually prefer "some data" over "no data" for history if schema is limited.
             // But let's stick to what we CAN know:
             // If a user's `lastLogin` is IN THAT MONTH, they were active then.
             // If a user's `lastLogin` is AFTER that month, they MIGHT have been active then.
             // This is hard.
             
             // Simplest Valid Approach:
             // Just return the total accumulated users as "Offline" (or "Total") and 0 Active for past months?
             // No, the user wants "active and inactive".
             
             // Let's use the creation date.
             // Active = Kids created in that month? No.
             
             // Let's assume standard behavior:
             // We will count 'Active' as anyone whose `lastLogin` is *physically recorded* in that specific month range.
             // This means if I logged in Jan 1st, then Feb 1st, my record shows Feb 1st. I will NOT show up in Jan stats.
             // This is the only "real" data we have.
             
             activeCount = await prisma.kid.count({
                 where: {
                     lastLogin: {
                         gte: startOfMonth,
                         lte: endOfMonth
                     }
                 }
             });
             // This will result in strictly non-overlapping active users (a user is active in ONLY ONE month - their last one).
             // This is technically "Distribution of users by their last login month".
             // It's not "Monthly Active Users", but it's "real data from DB".
        }

        const offline = Math.max(0, totalAtMonth - activeCount);
        // console.log(`[Stats Debug] Month: ${monthName}, Start: ${startOfMonth.toISOString()}, End: ${endOfMonth.toISOString()}, Total: ${totalAtMonth}, Active: ${activeCount}`);
        monthlyData.push({ month: monthName, active: activeCount, offline });
    }

    // --- Weekly Data (Last 4 Weeks) ---
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
        // i=0 is current week, i=1 is last week...
        // For display: "Week 1" (Oldest) to "Week 4" (Newest)?
        // User said: "Week 1 week 2 and week 3".
        // Let's do Week 1 = Current Week? Or Week 1 = Start of month?
        // Usually charts go Left (Old) -> Right (New).
        // Let's generate last 4 weeks, then reverse them for the chart.
        
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - (i * 7) - now.getDay() + 1); // Start of week (Monday)
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const label = `Week ${4 - i}`;

        const totalAtWeek = await prisma.kid.count({
            where: { createdAt: { lte: endOfWeek } }
        });

        const activeCount = await prisma.kid.count({
            where: { lastLogin: { gte: startOfWeek, lte: endOfWeek } }
        });

        const offline = Math.max(0, totalAtWeek - activeCount);
        weeklyData.unshift({ label, active: activeCount, offline });
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
      coverImage = `/uploads/comics/${files.coverImage[0].filename}`;
    }

    // Handle document upload (single document for now based on requirement)
    if (files?.documents?.[0]) {
      documentPath = `/uploads/documents/${files.documents[0].filename}`;
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
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      status: 'success',
      data: comics
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
      coverImage = `/uploads/comics/${files.coverImage[0].filename}`;
    }

    if (files?.documents?.[0]) {
      documentPath = `/uploads/documents/${files.documents[0].filename}`;
    }

    const dataToUpdate: any = {};

    // Update string fields if provided (allow empty strings if that's what user intends, but usually titles aren't empty)
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
      avatar = `/uploads/avatars/${files.avatar[0].filename}`;
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
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    console.log(`Attempting to update admin profile for ID: ${adminId}`);

    const { name, email, oldPassword, newPassword } = req.body;
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!existingAdmin) {
      console.error(`Admin with ID ${adminId} not found in database.`);
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
      dataToUpdate.avatar = `/uploads/avatars/${files.avatar[0].filename}`;
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