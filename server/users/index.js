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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var checkUsername_1 = require("./checkUsername");
var types_1 = require("./types");
var createUser_1 = require("./createUser");
var login_1 = require("./login");
var user_1 = require("../Models/user");
var router = express_1.default.Router();
router.get("/check", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                username = req.query.username;
                if (typeof username != "string" || !username.length)
                    return [2 /*return*/, res.sendStatus(400)];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                _b = (_a = res).json;
                _d = {};
                return [4 /*yield*/, checkUsername_1.doesUsernameExist(username)];
            case 2:
                _b.apply(_a, [(_d.available = !(_e.sent()),
                        _d)]);
                return [3 /*break*/, 4];
            case 3:
                _c = _e.sent();
                res.json({
                    error: "Something went wrong, please try again later.",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                if (!types_1.isUser(user))
                    return [2 /*return*/, res.sendStatus(400)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, createUser_1.createUser(user.name, user.username, user.age, user.email, user.password)];
            case 2:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                res.json({
                    error: "Something went wrong, please try again later.",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var creds, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                creds = req.body.credentials;
                if (!creds ||
                    typeof creds !== "object" ||
                    typeof creds["password"] !== "string" ||
                    typeof creds["username"] !== "string" ||
                    typeof creds["rememberMe"] !== "boolean")
                    return [2 /*return*/, res.sendStatus(400)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, login_1.login(creds.username, creds.password)];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, login_1.createJWTCookie(creds.username, res, creds.rememberMe ? 7 * 24 * 60 * 60 : undefined)];
            case 3:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 5];
            case 4:
                res.json({ error: "Invalid username or password" });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_2 = _a.sent();
                res.json({
                    error: "Something went wrong, please try again later.",
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post("/logout", function (req, res) {
    res.clearCookie("token");
    return res.json({ success: true });
});
router.get("/fetch/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                username = req.params.username;
                if (!username)
                    return [2 /*return*/, res.sendStatus(400)];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                // Can be extended with roles and rights
                if (username !== ((_b = req.context.user) === null || _b === void 0 ? void 0 : _b.username)) {
                    return [2 /*return*/, res.json({ error: "You are not authorized", code: 401 })];
                }
                return [4 /*yield*/, user_1.UserModel.findOne({ username: username })];
            case 2:
                user = _c.sent();
                if (user)
                    return [2 /*return*/, res.json({
                            user: {
                                username: user.username,
                                name: user.name,
                                email: user.email,
                                age: user.age,
                            },
                        })];
                res.json({ error: "User not found" });
                return [3 /*break*/, 4];
            case 3:
                _a = _c.sent();
                res.json({ error: "Something went wrong. Try again later" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/viewer", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                username = (_b = req.context.user) === null || _b === void 0 ? void 0 : _b.username;
                if (!username)
                    return [2 /*return*/, res.json({ user: null })];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_1.UserModel.findOne({ username: username })];
            case 2:
                user = _c.sent();
                if (user)
                    return [2 /*return*/, res.json({
                            user: {
                                username: user.username,
                                name: user.name,
                                email: user.email,
                                age: user.age,
                            },
                        })];
                res.json({ error: "User not found" });
                return [3 /*break*/, 4];
            case 3:
                _a = _c.sent();
                res.json({ error: "Something went wrong. Try again later" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
