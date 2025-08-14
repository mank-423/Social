import { Request, Response } from "express";
import User from "../models/user.model";
import { generateAccessToken, generateToken } from "../utils/tokenGenerate";
import bcrypt from 'bcryptjs'
import cloudinary from "../utils/cloudinary";
import jwt from 'jsonwebtoken';
import { signUpValidation } from "../validations/auth.validation";
import { AuthService } from "../services/auth.service";

// Sign up 
export const signUp = async (req: Request, res: Response) => {
  try {

    const { email, fullName, password } = req.body;

    const errors = await signUpValidation(fullName, email, password);

    if (errors.length > 0) {
      return res.status(400).json({ status: false, message: 'Error in credentials', error: errors });
    }

    const { user, accessToken } = await AuthService.signUp(email, fullName, password, res);

    return res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: user,
      accessToken
    });

  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User email is wrong');
      return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log('Password is wrong!')
      return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }

    if (user) {
      const accessToken = generateToken(user._id, res);
      return res.status(200).json({ user, accessToken });
    }

  } catch (error) {
    console.log('Error in login:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
}

// Logout
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie('jwt', "", { maxAge: 0 });
    return res.status(200).json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }

}


// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profileUrl } = req.body;

    const userId = req.user._id;

    if (!profileUrl) {
      return res.status(400).json({ status: false, message: 'Profile pic not provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profileUrl);

    const uploadUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

    return res.status(200).json({ status: true, message: 'Profile pic uploaded successfully', data: uploadUser })
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }

}

export const checkAuth = (req: Request, res: Response) => {
  try {
    return res.status(200).json({ status: true, data: req.user });
  } catch (error) {
    console.log('Error checking auth:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
}

export const generateRefreshToken = (req: Request, res: Response) => {
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ success: false, message: 'Refresh token not available' });

  let key: string;

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('Key not given')
  } else {
    key = process.env.JWT_SECRET_KEY;
  }

  jwt.verify(token, key, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ status: false, message: 'Invalid refresh token' })
    const accessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ status: true, message: 'New access token', data: accessToken });
  })

}
