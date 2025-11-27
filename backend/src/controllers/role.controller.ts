import { Request, Response } from "express";
import Role from "../models/role.model";
import { OK, Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({ deleted: false });
    return new OK({
      message: "Roles fetched successfully",
      metadata: roles,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching roles").send(res);
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const newRole = new Role(req.body);
    await newRole.save();
    return new Created({
      message: "Role created successfully",
      metadata: newRole,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error creating role").send(res);
  }
};

export const editRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    const updatedRole = await Role.findById(id);
    return new OK({
      message: "Role updated successfully",
      metadata: updatedRole,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating role").send(res);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true });
    return new OK({
      message: "Role deleted successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error deleting role").send(res);
  }
};
