import { Response, Request } from "express";
import sendMailThankYou from "../utils/SendMail/sendMailThankyou";
export const createPayment = async (req: Request, res: Response) => {
  try {
    // Your payment creation logic here
    const email = req.body.email;
    await sendMailThankYou(email);
    res.status(201).json({ message: "Payment created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
