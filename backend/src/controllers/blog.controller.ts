import { Response, Request } from "express";
import Blog from "../models/blog.model";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ deleted: false });
    return new OK({
      message: "Blogs fetched successfully",
      metadata: blogs,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    return new OK({
      message: "Blog created successfully",
      metadata: newBlog,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Blog.updateOne({ _id: id }, req.body);
    return new OK({
      message: "Blog updated successfully",
      metadata: await Blog.findOne({ _id: id }),
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const DeleteBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Blog.updateOne({ _id: id }, { deleted: true });
    return new OK({
      message: "Blog deleted successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
