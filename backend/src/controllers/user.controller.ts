import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {
  createToken,
  createRefreshToken,
  createApiKey,
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

    const token = await createToken(payload);
    const refreshToken = await createRefreshToken(payload);

    res.json({
      code: 200,
      message: "Login successful",
      data: {
        token,
        refreshToken,
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
