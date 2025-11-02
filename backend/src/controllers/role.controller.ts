import { Request, Response } from "express";
import Role from "../models/role.model";
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles" });
  }
};
export const createRole = async (req: Request, res: Response) => {
  try {
    const newRole = new Role(req.body);
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Error creating role" });
  }
};
export const editRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
