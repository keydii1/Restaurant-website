import { Request, Response } from "express";
import User from "../models/user.model";
import OTP from "../models/otp.model";
import * as GenerateHelper from "../helpers/generate.helper";
import SendMailForgotPassword from "../utils/SendMail/sendMailForgotPasswords";
import bcrypt from "bcrypt";
import {
  createToken,
  createRefreshToken,
  createApiKey,
  verifyToken,
} from "../utils/auth/tokenServices";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({
      code: 200,
      message: "Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await newUser.save();

    // Create API key for JWT
    await createApiKey(newUser._id.toString());

    res.status(201).json({
      code: 201,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Email or password is incorrect",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        code: 401,
        message: "Email or password is incorrect",
      });
    }

    // Generate tokens
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const accessToken = await createToken(payload);
    const refreshToken = await createRefreshToken(payload);

    // Set refresh token in HttpOnly cookie (auto-sent with requests)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      code: 200,
      message: "Login successful",
      data: {
        accessToken: accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User with this email does not exist",
      });
    }

    // Generate OTP
    const otpCode = GenerateHelper.generateOTP();

    // Save OTP to database
    const otpEntry = new OTP({
      userId: user._id,
      code: otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
    });
    await otpEntry.save();
    //sent OTP to user's email (omitted for brevity)
    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otpCode}. It is valid for 5 minutes.`;
    await SendMailForgotPassword(email, otpCode);

    res.json({
      code: 200,
      message: "OTP sent to email successfully",
    });
    // after that, page will redirect to reset password page
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User with this email does not exist",
      });
    }

    // Find OTP entry
    const otpEntry = await OTP.findOne({ userId: user._id, code: otp });
    if (!otpEntry) {
      return res.status(400).json({
        code: 400,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < new Date()) {
      // Delete expired OTP
      await OTP.deleteOne({ _id: otpEntry._id });
      return res.status(400).json({
        code: 400,
        message: "OTP has expired",
      });
    }

    // Mark OTP as used and delete it immediately after verification
    await OTP.deleteOne({ _id: otpEntry._id });

    res.json({
      code: 200,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User with this email does not exist",
      });
    }

    // Find OTP entry
    const otpEntry = await OTP.findOne({ userId: user._id, code: otp });
    if (!otpEntry) {
      return res.status(400).json({
        code: 400,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < new Date()) {
      // Delete expired OTP
      await OTP.deleteOne({ _id: otpEntry._id });
      return res.status(400).json({
        code: 400,
        message: "OTP has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP entry after successful password reset
    await OTP.deleteOne({ _id: otpEntry._id });

    res.json({
      code: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookies (automatically sent by browser)
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        code: 401,
        message: "Refresh token not found, please login again",
      });
    }

    // Verify refresh token
    const decoded = await verifyToken(refreshToken);
    const { id } = decoded;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "User not found, please login again",
      });
    }

    // Generate new access token
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const newAccessToken = await createToken(payload);

    res.json({
      code: 200,
      message: "Access token refreshed",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: "Refresh token invalid or expired, please login again",
      error: (error as any).message,
    });
  }
};
