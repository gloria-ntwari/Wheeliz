import type { Request, Response } from 'express';
import prisma from '../config/prisma';


export const kidLogin = async (req: Request, res: Response) => {
    try {
        const { parentPhone, dateOfBirth } = req.body;

        if (!parentPhone || !dateOfBirth) {
            return res.status(400).json({
                status: 'error',
                message: 'Parent phone and date of birth are required'
            });
        }

        const existingKid  = await prisma.kid.findUnique({
            where: { parentPhone }
        });

        if(existingKid){
            const inputDOB = new Date(dateOfBirth).toISOString().split('T')[0];
            const kidDOB = existingKid.dateOfBirth.toISOString().split('T')[0];

            if(inputDOB == kidDOB){
                return res.status(401).json({
                    status: 'success',
                    message: 'Login Successful',
                    data: {
                        kid: {
                            id: existingKid.id,
                            name: existingKid.name,
                            parentPhone: existingKid.parentPhone,
                            dateOfBirth: existingKid.dateOfBirth
                        }
                    }
                });
            } else {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
        }
        return res.json({
            status: 'error',
            message: 'This phone number is not registered'
        });
    } catch (error){
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};  
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
                name,
                parentPhone,
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