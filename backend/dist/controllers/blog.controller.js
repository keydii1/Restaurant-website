"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlog = exports.edit = exports.create = exports.getBlogDetail = exports.getBlogs = void 0;
const blog_model_1 = __importDefault(require("../models/blog.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_model_1.default.find({ deleted: false });
        return new success_response_1.OK({
            message: "Blogs fetched successfully",
            metadata: blogs,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getBlogs = getBlogs;
const getBlogDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const blog = yield blog_model_1.default.findOne({ _id: id, deleted: false });
        return new success_response_1.OK({
            message: "Blog detail fetched successfully",
            metadata: blog,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getBlogDetail = getBlogDetail;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlog = new blog_model_1.default(req.body);
        yield newBlog.save();
        return new success_response_1.OK({
            message: "Blog created successfully",
            metadata: newBlog,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield blog_model_1.default.updateOne({ _id: id }, req.body);
        return new success_response_1.OK({
            message: "Blog updated successfully",
            metadata: yield blog_model_1.default.findOne({ _id: id }),
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.edit = edit;
const DeleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleteBlog = yield blog_model_1.default.findOne({ _id: id });
        yield blog_model_1.default.updateOne({ _id: id }, { deleted: true });
        return new success_response_1.OK({
            message: "Blog deleted successfully",
            metadata: deleteBlog,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.DeleteBlog = DeleteBlog;
