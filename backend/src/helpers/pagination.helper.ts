import { Request } from "express";
const getPagination = (objectPagination: any, req: any, totalDish: number) => {
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page as string);
  }
  const totalPages = Math.ceil(totalDish / objectPagination.limit);
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limit;
  objectPagination.totalPages = totalPages;
  return objectPagination;
};

export default getPagination;
