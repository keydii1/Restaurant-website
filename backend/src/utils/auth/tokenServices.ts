import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { IApiKey, ApiKeyModel } from "../../models/apiKey.model";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../../models/user.model";
dotenv.config();

export const createApiKey = async (userId: string): Promise<IApiKey> => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  // sau khi gọi hàm createKeyPairSync, ta sẽ nhận được 2 object key
  // nó là một object phức tạp, không thể lưu trực tiếp vào database được
  // vì vậy mục tiêu cảu export này là để chuyển đổi định dạng key sang chuỗi text, bời vì
  // mình không thể lưu trữ trực tiếp object key vào database được
  const privateKeyString = privateKey.export({
    type: "pkcs8",
    format: "pem",
  }) as string;
  const publicKeyString = publicKey.export({
    type: "spki",
    format: "pem",
  }) as string;

  const newApiKey = new ApiKeyModel({
    userId,
    publicKey: publicKeyString,
    privateKey: privateKeyString,
  });
  return await newApiKey.save();
};

export const createAccessToken = async (payload: any): Promise<string> => {
  const findApiKey = await ApiKeyModel.findOne({
    userId: payload.id.toString(),
  });

  if (!findApiKey?.privateKey) {
    throw new Error("Private key not found for user");
  }

  return jwt.sign(payload, findApiKey.privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
  } as SignOptions);
};

export const createRefreshToken = async (payload: any): Promise<string> => {
  const findApiKey = await ApiKeyModel.findOne({
    userId: payload.id.toString(),
  });

  if (!findApiKey?.privateKey) {
    throw new Error("Private key not found for user");
  }

  return jwt.sign(payload, findApiKey.privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  } as SignOptions);
};
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // Get refresh token from cookies (automatically sent by browser)
    const refreshToken = req.cookies.refreshToken;

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

    const newAccessToken = await createAccessToken(payload);

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

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded = jwtDecode<{ id: string }>(token);
    const { id } = decoded;
    const findApiKey = await ApiKeyModel.findOne({ userId: id });

    if (!findApiKey) {
      throw new Error("Please log in again");
    }

    return jwt.verify(token, findApiKey.publicKey, {
      algorithms: ["RS256"],
    });
  } catch (error) {
    throw new Error("Please log in again");
  }
};
