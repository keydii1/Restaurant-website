import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { IApiKey, ApiKeyModel } from "../../models/apiKey.model";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
dotenv.config();

export const createApiKey = async (userId: string): Promise<IApiKey> => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
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

export const createToken = async (payload: any): Promise<string> => {
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
