"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCreateArticlePayload = void 0;
function isCreateArticlePayload(payload) {
    if (!payload || typeof payload !== "object")
        return false;
    return (typeof payload["title"] === "string" &&
        typeof payload["description"] === "string" &&
        payload["description"].length <= 255 &&
        typeof payload["content"] === "string" &&
        Array.isArray(payload["tags"]) &&
        payload["tags"].length <= 5 &&
        payload["tags"].every(function (e) { return typeof e === "string"; }));
}
exports.isCreateArticlePayload = isCreateArticlePayload;
