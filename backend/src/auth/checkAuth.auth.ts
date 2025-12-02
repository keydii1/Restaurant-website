import { verifyToken } from "../utils/auth/tokenServices";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader) {
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    } else {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập",
      });
    }

    const decoded = await verifyToken(token);
    (req as any).accessToken = decoded;
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
    // Try to get token from cookies first
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader) {
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    } else {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập",
      });
    }

    const decoded = await verifyToken(token);
    const { id } = decoded;
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }
    if (findUser.isAdmin === false) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền truy cập, Bạn không phải là admin",
      });
    }

    (req as any).accessToken = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Token không hợp lệ hoặc hết hạn",
      error: (error as any).message,
    });
  }
};

export { auth, authAdmin };
