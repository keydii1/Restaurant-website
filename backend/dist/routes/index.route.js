"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerAppVer1 = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_route_1 = __importDefault(require("./user.route"));
const dish_route_1 = __importDefault(require("./dish.route"));
const routerAppVer1 = (app) => {
    const version1 = process.env.PREFIX;
    app.use(version1 + "/users", user_route_1.default);
    app.use(version1 + "/dishes", dish_route_1.default);
};
exports.routerAppVer1 = routerAppVer1;
exports.default = exports.routerAppVer1;
