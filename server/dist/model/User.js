"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSave = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// ------------------ Auth User Schema ------------------
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    url: { type: String, required: false },
}, { timestamps: true });
// ------------------ Data Save Schema 
const UserDataSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String, required: false },
}, { timestamps: true });
// ------------------ Models ------------------
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.UserSave = (0, mongoose_1.model)("UserSave", UserDataSchema);
