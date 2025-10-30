import { Request, Response } from "express";
export const register = (req: Request, res: Response) => {
  res.json({ message: "User registered successfully" });
};
