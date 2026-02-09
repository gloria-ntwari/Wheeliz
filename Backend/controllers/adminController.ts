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
    const { title, subtitle, description, image, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;

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
        image: image as string,
        category: category as string,
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
        bonus: bonus ? parseInt(bonus) : 0,
        totalMarks: totalMarks ? parseInt(totalMarks) : 0,
        maxUploads: maxUploads ? parseInt(maxUploads) : 1
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
    const { title, subtitle, description, image, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;

    const comic = await (prisma.comic as any).update({
      where: { id: id as string },
      data: {
        title: title as string,
        subtitle: subtitle as string,
        description: description as string,
        image: image as string,
        category: category as string,
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : undefined,
        bonus: bonus ? parseInt(bonus) : undefined,
        totalMarks: totalMarks ? parseInt(totalMarks) : undefined,
        maxUploads: maxUploads ? parseInt(maxUploads) : undefined
      }
    });

    res.json({
      status: 'success',
      message: 'Comic updated successfully',
      data: comic
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
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
        const kids = await prisma.kid.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // Add related data counts if relations exist, otherwise just return basic info
                // Assuming relations might exist based on the frontend dummy data
                 _count: {
                    select: { 
                         submissions: true, 
                    }
                }
            }
        });

        // Transform data to match frontend expectations if needed
        const formattedKids = kids.map(kid => ({
            ...kid,
            status: 'Active', // Default status for now
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`, // Generate avatar
            comicsRead: 0, // Placeholder
            rank: 0,       // Placeholder
            submissions: 0 // Placeholder or use _count if available
        }));

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