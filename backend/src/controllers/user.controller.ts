import { Request, Response } from "express";
export const login = async (req: Request, res: Response) => {
  res.json({ message: "User login endpoint" });
};

export const register = async (req: Request, res: Response) => {
  res.json({ message: "User register endpoint" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  res.json({ message: "User forgot password endpoint" });
};
