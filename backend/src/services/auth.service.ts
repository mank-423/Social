import bcrypt from 'bcryptjs';
import User from "../models/user.model";
import { Types } from "mongoose";
import { Response } from "express";
import { generateToken } from '../utils/tokenGenerate';

export class AuthService {
    static async signUp(email: string, fullName: string, password: string, res: Response) {
        const saltRounds = process.env.HASH_SALT_ROUND;
        if (!saltRounds) throw new Error("Salting variable missing");

        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
            profileUrl: ""
        });

        await newUser.save();

        const accessToken = generateToken(newUser._id as Types.ObjectId, res);

        return { user: newUser, accessToken };
    }
}
