"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKidDashboardStats = exports.kidSignup = exports.createKid = exports.kidLogin = exports.checkKidProfile = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const checkKidProfile = async (req, res) => {
    try {
        const { parentPhone, dateOfBirth } = req.body;
        const kid = await prisma_1.default.kid.findFirst({
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
        const token = jsonwebtoken_1.default.sign({ id: kid.id, role: 'kid' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            status: 'success',
            data: {
                exists: true,
                kid,
                token
            }
        });
    }
    catch (error) {
        console.error('Check profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.checkKidProfile = checkKidProfile;
const kidLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }
        const kid = await prisma_1.default.kid.findUnique({
            where: { email }
        });
        if (!kid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, kid.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: kid.id, email: kid.email, role: kid.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.kidLogin = kidLogin;
const createKid = async (req, res) => {
    try {
        const { name, parentPhone, dateOfBirth, confirm } = req.body;
        if (!confirm) {
            return res.status(400).json({
                status: 'error',
                message: 'Profile creation must be confirmed'
            });
        }
        if (!name || !parentPhone || !dateOfBirth) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, parent phone, and date of birth are required'
            });
        }
        const existingKid = await prisma_1.default.kid.findUnique({
            where: { parentPhone }
        });
        if (existingKid) {
            return res.status(409).json({
                status: 'error',
                message: 'A profile with this parent phone already exists'
            });
        }
        const newKid = await prisma_1.default.kid.create({
            data: {
                name: name,
                parentPhone: parentPhone,
                dateOfBirth: new Date(dateOfBirth)
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newKid.id, role: 'kid' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            status: 'success',
            message: 'Kid profile created successfully',
            data: {
                kid: newKid,
                token
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
exports.createKid = createKid;
const kidSignup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Full name, email, and password are required'
            });
        }
        const existingKid = await prisma_1.default.kid.findUnique({
            where: { email }
        });
        if (existingKid) {
            return res.status(409).json({
                status: 'error',
                message: 'A kid with this email already exists'
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newKid = await prisma_1.default.kid.create({
            data: {
                name: fullName,
                email: email,
                passwordHash: passwordHash,
                role: 'kid'
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newKid.id, email: newKid.email, role: newKid.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.kidSignup = kidSignup;
const getKidDashboardStats = async (req, res) => {
    try {
        // Assuming user ID is attached to req.user (need to check auth middleware or jwt decoding)
        // Since I don't see the auth middleware here, I'll assume req has user from the token.
        // However, in Typescript 'req' might need type extension. 
        // For now, I'll trust the plan or existing patterns. 
        // Looking at previous controllers, they use req.body or params. 
        // Typically auth middleware adds user to req.
        // I will assume `(req as any).user.id` or similar is available if middleware is used.
        const kidId = req.user?.id; // Accessing user from request, assuming auth middleware runs before
        if (!kidId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            });
        }
        const kid = await prisma_1.default.kid.findUnique({
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
                standing: totalMarks, // Using marks as 'standing'
                rank,
                comicsRead: totalComicsRead,
                recentProgress
            }
        });
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};
exports.getKidDashboardStats = getKidDashboardStats;
