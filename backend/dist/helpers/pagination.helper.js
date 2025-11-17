"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPagination = (objectPagination, req, totalDish) => {
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }
    const totalPages = Math.ceil(totalDish / objectPagination.limit);
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limit;
    objectPagination.totalPages = totalPages;
    return objectPagination;
};
exports.default = getPagination;
