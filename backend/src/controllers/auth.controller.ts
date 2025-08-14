import { Request, Response } from "express";
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
    const {user, accessToken, error} = await AuthService.logIn(email, password, res);

    if (error) {
      return res.status(400).json({ status: false, message: error });
    }

    if (accessToken) {
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

    const {user, error} = await AuthService.updateProfile(profileUrl, userId);

    if (error) {
      return res.status(400).json({ status: false, message: error });
    }

    return res.status(200).json({ status: true, message: 'Profile pic uploaded successfully', data: user })
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }

}

// Check auth
export const checkAuth = (req: Request, res: Response) => {
  try {
    return res.status(200).json({ status: true, data: req.user });
  } catch (error) {
    console.log('Error checking auth:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
}

// Generate refresh token
export const generateRefreshToken = (req: Request, res: Response) => {
  const token = req.cookies.jwt;

  const {error, accessToken} = AuthService.generateRefreshToken(token);

  if (error){
    console.log('Error:', error);
    return res.status(500).json({status: false, message:'Internal Server Error'});
  }

  return res.status(200).json({ status: true, message: 'New access token', data: accessToken });
}
