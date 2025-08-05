import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { NextFunction, Request, Response } from 'express'

// At top of auth.middleware.ts
declare global {
    namespace Express {
        interface Request {
            user?: any; // Or use your IUser interface if imported
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ status: false, message: 'Unauthorized: token not provided' });
        }

        let key: string;

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('Key not given')
        } else {
            key = process.env.JWT_SECRET_KEY;
        }

        const decoded = jwt.verify(token, key);

        if (typeof decoded === 'string' || !('userId' in decoded)) {
            return res.status(401).json({ status: false, message: 'Unauthorized: invalid token' });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log('Error in protect route:', error);
    }
}