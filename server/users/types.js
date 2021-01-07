"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
function isUser(user) {
    if (!user || typeof user !== "object")
        return false;
    return ("name" in user &&
        typeof user["name"] === "string" &&
        user["name"].length > 0 &&
        "email" in user &&
        typeof user["email"] === "string" &&
        user["email"].length > 0 &&
        "username" in user &&
        typeof user["username"] === "string" &&
        user["username"].length > 0 &&
        "password" in user &&
        typeof user["password"] === "string" &&
        user["password"].length > 0 &&
        "age" in user &&
        typeof user["age"] === "number" &&
        user["age"] >= 0);
}
exports.isUser = isUser;
