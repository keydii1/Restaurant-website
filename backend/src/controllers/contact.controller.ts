import { Request, Response } from "express";
import Contact from "../models/contact.model";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find();
    return new OK({
      message: "Contacts fetched successfully",
      metadata: contacts,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    return new OK({
      message: "Contact created successfully",
      metadata: newContact,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Contact.updateOne({ _id: id }, req.body);
    return new OK({
      message: "Contact updated successfully",
      metadata: await Contact.findOne({ _id: id }),
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const ids = await Contact.find({
      status: "Resolved",
    });
    await Contact.deleteMany({ _id: { $in: ids } });
    return new OK({
      message: "Contacts deleted successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
