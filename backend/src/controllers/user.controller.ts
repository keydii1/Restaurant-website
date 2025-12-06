import { Request, Response } from "express";
import User from "../models/user.model";
import OTP from "../models/otp.model";
import * as GenerateHelper from "../helpers/generate.helper";
import SendMailForgotPassword from "../utils/SendMail/sendMailForgotPasswords";
import bcrypt from "bcrypt";
import { google } from "googleapis";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";
import {
  createAccessToken,
  refreshAccessToken,
  createRefreshToken,
  createApiKey,
} from "../utils/auth/tokenServices";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return new OK({
      message: "Success",
      metadata: users,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // Check if user already exists

    // Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser = new User(req.body);

    await newUser.save();

    await createApiKey(newUser._id.toString());

    return new OK({
      message: "User registered successfully",
      metadata: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;

    // Update user profile
    await User.updateOne({ _id: userId }, { $set: req.body });
    const updatedUser = await User.findById(userId).select(
      "username email phone avatar dateOfBirth address"
    );

    return new OK({
      message: "Profile updated successfully",
      metadata: updatedUser,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return new BadRequestError("Email does not exist").send(res);
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new BadRequestError("Password is incorrect").send(res);
    }

    // Generate tokens
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    // Set refresh token in HttpOnly cookie (auto-sent with requests)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return new OK({
      message: "Login successful",
      metadata: {
        accessToken: accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new BadRequestError("User with this email does not exist").send(
        res
      );
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

    await SendMailForgotPassword(email, otpCode);

    return new OK({
      message: "OTP sent to email successfully",
    }).send(res);
    // after that, page will redirect to reset password page
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new BadRequestError("User with this email does not exist").send(
        res
      );
    }

    // Find OTP entry
    const otpEntry = await OTP.findOne({ userId: user._id, code: otp });
    if (!otpEntry) {
      return new BadRequestError("Invalid OTP").send(res);
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < new Date()) {
      // Delete expired OTP
      await OTP.deleteOne({ _id: otpEntry._id });
      return new BadRequestError("OTP has expired").send(res);
    }

    // Mark OTP as used and delete it immediately after verification
    await OTP.deleteOne({ _id: otpEntry._id });

    return new OK({
      message: "OTP verified successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.newPassword;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new BadRequestError("User with this email does not exist").send(
        res
      );
    }

    // Find OTP entry
    const otpEntry = await OTP.findOne({ userId: user._id, code: otp });
    if (!otpEntry) {
      return new BadRequestError("Invalid OTP").send(res);
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < new Date()) {
      // Delete expired OTP
      await OTP.deleteOne({ _id: otpEntry._id });
      return new BadRequestError("OTP has expired").send(res);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP entry after successful password reset
    await OTP.deleteOne({ _id: otpEntry._id });

    return new OK({
      message: "Password reset successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // clear access token on client side
    return new OK({
      message: "Logout successful",
      metadata: null,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Internal server error").send(res);
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const newAccessToken = await refreshAccessToken(req);
    return new OK({
      message: "Access token refreshed successfully",
      metadata: { accessToken: newAccessToken },
    }).send(res);
  } catch (error) {
    return new BadRequestError(
      (error as any).message || "Internal server error"
    ).send(res);
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    // The Google OAuth process would typically redirect the user to Google's login page
    // and then back to your application with an authorization code.
    // Here, we would handle that code, exchange it for tokens, and log the user in.
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
      // Callback URL after user grants permission
    );
    const SCOPES = ["profile", "email"];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Request refresh token
      prompt: "consent", // Force consent screen
      scope: SCOPES, // Request profile and email
    });
    console.log("Redirecting to Google OAuth2 consent screen:", authUrl);
    res.redirect(authUrl);
  } catch (error) {
    return new BadRequestError(
      (error as any).message || "Internal server error"
    ).send(res);
  }
};
export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      console.log("No code provided");
      return res.redirect("/");
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
      // Callback URL after user grants permission
    );

    try {
      // Exchange authorization code for access token
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      console.log(tokens.access_token);
      console.log(tokens.refresh_token);
      console.log(tokens.expiry_date);
      // Get user info from Google OAuth2 userinfo endpoint
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const userinfo = await oauth2.userinfo.get();

      // Store only refresh token in session (more secure)
      // Access token will be refreshed when needed using refresh token
      const user = await User.findOne({
        googleId: userinfo.data.id,
      });
      if (user) {
        return new BadRequestError("User already exists").send(res);
      }
      if (!user) {
        // If user does not exist, create a new user
        const newUser = new User({
          username: userinfo.data.name,
          email: userinfo.data.email,
          password: "", // No password for Google-authenticated users
          googleId: userinfo.data.id,
          loginMethod: "google",
          isAdmin: false,
          avatar: userinfo.data.picture || "", // Get avatar from Google
          refreshToken: tokens.refresh_token,
        });
        await newUser.save();
        console.log("New user created:", newUser.email);
      } else {
        console.log("Existing user logged in:", user.email);
      }

      console.log("User logged in:", userinfo.data.email);
      return res.redirect("/profile");
    } catch (err) {
      return res.status(500).send("Authentication error");
    }
  } catch (error) {
    return new BadRequestError(
      (error as any).message || "Internal server error"
    ).send(res);
  }
};
