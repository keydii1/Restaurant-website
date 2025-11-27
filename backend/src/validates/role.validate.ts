import { Request, Response } from "express";
import Role from "../models/role.model";

export const nameRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({ message: "Role name is required" });
  }
  next();
};

export const nameLength = (req: Request, res: Response, next: Function) => {
  if (req.body.name && req.body.name.length > 50) {
    return res
      .status(400)
      .json({ message: "Role name must not exceed 50 characters" });
  }
  next();
};

export const nameUnique = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const name = req.body.name;
  if (name) {
    const existingRole = await Role.findOne({ name: name });
    if (existingRole && existingRole._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Role name already exists" });
    }
  }
  next();
};

export const descriptionLength = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.body.description && req.body.description.length > 500) {
    return res
      .status(400)
      .json({ message: "Description must not exceed 500 characters" });
  }
  next();
};

export const permissionsValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.body.permissions && !Array.isArray(req.body.permissions)) {
    return res
      .status(400)
      .json({ message: "Permissions must be an array of strings" });
  }
  next();
};
