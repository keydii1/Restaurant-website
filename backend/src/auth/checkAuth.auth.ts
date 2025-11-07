import {
  BadUserRequestError,
  BadUser2RequestError,
} from "../../core/error.response";
import { verifyToken } from "../utils/auth/tokenServices";
import modelUser from "../models/user.model";
import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập",
      });
    }

    const decoded = await verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Token không hợp lệ hoặc hết hạn",
      error: (error as any).message,
    });
  }
};

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Bạn không có quyền truy cập",
      });
    }

    const decoded = await verifyToken(token);
    const { id } = decoded;
    const findUser = await modelUser.findById(id);

    if (!findUser || findUser.isAdmin === false) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền truy cập",
      });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Token không hợp lệ hoặc hết hạn",
      error: (error as any).message,
    });
  }
};

export { asyncHandler, authUser, authAdmin };
