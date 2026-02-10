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

    res.json({
      status: 'success',
      data: {
        totalComics,
        totalSubmissions,
        totalKids,
        totalAdmins,
        greeting
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
        lastLogin: true,
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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`,
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
        role: updatedAdmin.role
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};