"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    image: { type: String },
    content: { type: String, required: true },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: "blogs",
});
const Blog = (0, mongoose_1.model)("Blog", blogSchema);
exports.default = Blog;
