import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/tokenGenerate";
import bcrypt from 'bcryptjs'
import cloudinary from "../utils/cloudinary";

// Sign up 
export const signUp = async (req: Request, res: Response) => {
  try {

    const { email, fullName, password } = req.body;

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const checkForRegex = (pattern: RegExp, pass: string): boolean => {
      return pattern.test(pass);
    }

    let errors: { key: string, message: string }[] = [];

    // Password validation
    if (password) {
      let passwordMessage = ""

      // Length
      if (password.length < 6) {
        passwordMessage += 'Length should be greater than 6.'
      }

      // Regex
      if (!checkForRegex(passwordPattern, password)) {
        passwordMessage += 'Check if password has 1 upper, 1 lower, and 1 alphabet.'
      }

      if (passwordMessage.length > 0) {
        errors.push({
          key: 'password',
          message: passwordMessage
        });
      }
    }

    if (email) {
      const user = await User.findOne({ email });
      let emailError = ""

      if (user) {
        emailError += "User already exists on this email."
      }

      if (!checkForRegex(emailPattern, email)) {
        emailError += "Email format is wrong."
      }

      if (emailError.length > 0) {
        errors.push({
          key: 'email',
          message: emailError
        })
      }
    }

    if (fullName.length <= 0) {
      errors.push({
        key: 'name',
        message: 'Full Name is required',
      })
    }

    if (errors.length > 0) {
      return res.status(400).json({ status: false, message: 'Error in credentials', error: errors });
    }

    const saltRounds = process.env.HASH_SALT_ROUND;

    if (!saltRounds) throw new Error("Salting variable missing");

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email, 
      fullName, 
      password: hashedPassword, 
      profileUrl: ""
    })

    if (newUser) {
      // generate web token
      await newUser.save();
      generateToken(newUser._id, res);

      return res.status(201).json({ status: true, message: 'User created successfully', data: newUser });
    } else {
      return res.status(400).json({ status: false, message: 'Error creating user' });
    }

  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error"});
  }
}

// Login
export const login = async(req: Request, res: Response) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user){
      console.log('User email is wrong');
      return res.status(400).json({status: false, message: 'Invalid credentials'});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect){
      console.log('Password is wrong!')
      return res.status(400).json({status: false, message: 'Invalid credentials'});
    }

    if (user){
      generateToken(user._id, res);
      return res.status(200).json({user});
    }

  } catch (error) {
    console.log('Error in login:', error);
    return res.status(500).json({status: false, message: 'Internal Server Error'});
  }
}

// Logout
export const logout = (req: Request, res: Response) => {
  try {
    res.cookie('jwt', "", {maxAge: 0});
    return res.status(200).json({status: true, message: "Logged out successfully"});
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({status: false, message: 'Internal Server Error'});
  }
  
}


// Update profile
export const updateProfile = async(req: Request, res: Response) => {
  try {
    const {profileUrl} = req.body;

    const userId = req.user._id;

    if (!profileUrl){
      return res.status(400).json({status: false, message: 'Profile pic not provided'});
    }

    const uploadResponse = await cloudinary.uploader.upload(profileUrl);

    const uploadUser = await User.findByIdAndUpdate(userId, {profileUrl: uploadResponse.secure_url}, {new: true})

    return res.status(200).json({status: true, message: 'Profile pic uploaded successfully', data: uploadUser})
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({status: false, message: 'Internal Server Error'});
  }
  
}

export const checkAuth = (req: Request, res: Response) => {
  try {
    return res.status(200).json({status: true, data: req.user});
  } catch (error) {
    console.log('Error checking auth:', error);
    return res.status(500).json({status: false, message: 'Internal Server Error'});
  }
}