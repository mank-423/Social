import bcrypt from 'bcryptjs';
import User from "../models/user.model";
import { Types } from "mongoose";
import { Response } from "express";
import { generateAccessToken, generateToken } from '../utils/tokenGenerate';
import cloudinary from '../utils/cloudinary';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class AuthService {
    static async signUp(email: string, fullName: string, password: string, res: Response) {
        const saltRounds = process.env.HASH_SALT_ROUND;
        if (!saltRounds) throw new Error("Salting variable missing");

        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));

        // encryption key
        const encryptionKey = crypto.randomBytes(32).toString('base64');

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
            profileUrl: "",
            encryptionKey: encryptionKey,
        });

        await newUser.save();

        const accessToken = generateToken(newUser._id as Types.ObjectId, res);

        return { user: newUser, accessToken };
    }


    static async logIn(email: string, password: string, res: Response) {
        const user = await User.findOne({ email });

        if (!user) {
            return { error: 'Invalid credentials', accessToken: '', user: null };
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return { error: 'Invalid password!', accessToken: '', user: null };
        }

        const accessToken = generateToken(user._id as Types.ObjectId, res);

        return { error: '', accessToken, user };
    }


    static async updateProfile(url: string, userId: Types.ObjectId) {
        if (!url) {
            return { error: "Url doesn't exists", user: '' };
        }

        const uploadResponse = await cloudinary.uploader.upload(url);
        const uploadUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        return { error: '', user: uploadUser };
    }

    static generateRefreshToken(token: string) {
        if (!token) {
            return { error: "Token doesn't exist", accessToken: '' };
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT secret key not set');
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const accessToken = generateAccessToken(decoded.userId);
            return { error: '', accessToken };
        } catch (err) {
            return { error: 'Invalid refresh token', accessToken: '' };
        }
    }

    static async updatePublicKey(publicKey: string, userId: string) {
        if (!publicKey || !userId) {
            return { error: 'UserId or Public key missing', status: false };
        }

        try {
            const user = await User.findByIdAndUpdate(userId, { pKey: publicKey }, { new: true });
            return { error: '', status: true };
        } catch (error) {
            console.log('Error occured', error);
            return { error, status: false }
        }
    }

}
