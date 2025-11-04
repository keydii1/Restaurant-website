import { Request, Response } from "express";
import Account from "../models/account.model";
export const getList = async (req: Request, res: Response) => {
  const allAccount = await Account.find();
  res.json({
    code: 200,
    message: "Success",
    data: allAccount,
  });
};
export const createAccount = async (req: Request, res: Response) => {
  try {
    const newAccount = new Account(req.body);
    await newAccount.save();
    res.json({
      code: 201,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Error creating account",
      error: error.message,
    });
  }
};
