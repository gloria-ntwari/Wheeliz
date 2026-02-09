"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllKids = exports.deleteComic = exports.updateComic = exports.getComicById = exports.getComics = exports.createComic = exports.getDashboardStats = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
// Admin Login
const adminLogin = async (req, res) => {
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
        const admin = await prisma_1.default.admin.findUnique({
            where: { email }
        });
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.adminLogin = adminLogin;
// Get Dashboard Statistics
const getDashboardStats = async (_req, res) => {
    try {
        const [totalComics, totalSubmissions, totalKids, totalAdmins] = await Promise.all([
            prisma_1.default.comic.count(),
            prisma_1.default.submission.count(),
            prisma_1.default.kid.count(),
            prisma_1.default.admin.count()
        ]);
        // Greeting logic
        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        if (hour < 12)
            greeting = 'Good Morning';
        else if (hour < 18)
            greeting = 'Good Afternoon';
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
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
// Create Comic
const createComic = async (req, res) => {
    try {
        const { title, subtitle, description, image, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;
        if (!title || !subtitle || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Title, subtitle, and description are required'
            });
        }
        const comic = await prisma_1.default.comic.create({
            data: {
                title,
                subtitle,
                description,
                image: image,
                category: category,
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
    }
    catch (error) {
        console.error('Create comic error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.createComic = createComic;
// Get All Comics
const getComics = async (_req, res) => {
    try {
        const comics = await prisma_1.default.comic.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            status: 'success',
            data: comics
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.getComics = getComics;
// Get Single Comic
const getComicById = async (req, res) => {
    try {
        const { id } = req.params;
        const comic = await prisma_1.default.comic.findUnique({
            where: { id: id }
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
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.getComicById = getComicById;
// Update Comic
const updateComic = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, image, category, submissionDeadline, bonus, totalMarks, maxUploads } = req.body;
        const comic = await prisma_1.default.comic.update({
            where: { id: id },
            data: {
                title: title,
                subtitle: subtitle,
                description: description,
                image: image,
                category: category,
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
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.updateComic = updateComic;
// Delete Comic
const deleteComic = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.comic.delete({
            where: { id: id }
        });
        res.json({
            status: 'success',
            message: 'Comic deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.deleteComic = deleteComic;
// Get All Kids
const getAllKids = async (req, res) => {
    try {
        const kids = await prisma_1.default.kid.findMany({
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
            rank: 0, // Placeholder
            submissions: 0 // Placeholder or use _count if available
        }));
        res.json({
            status: 'success',
            data: formattedKids
        });
    }
    catch (error) {
        console.error('Error fetching kids:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.getAllKids = getAllKids;
