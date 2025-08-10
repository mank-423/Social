import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId: Types.ObjectId, res: Response) => {
    let key: string;

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('Key not given')
    } else {
        key = process.env.JWT_SECRET_KEY;
    }

    const token = jwt.sign({ userId }, key, { expiresIn: '7d' });

    res.cookie('jwt', token, {
        httpOnly: true, // prevent XSS attacks cross-scripting attakcs
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF attack, cross-site request forgery attacks protection
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}