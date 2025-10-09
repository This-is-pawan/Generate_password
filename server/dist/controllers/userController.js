"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.DataSave = exports.findUser = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../model/User");
const mongoose_1 = require("mongoose");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json(`something is missing fromm input field`);
    }
    try {
        const exist = await User_1.UserModel.findOne({ email });
        if (exist) {
            res.json('user is already register');
        }
        const hashPasword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.UserModel.create({ name, email, password: hashPasword });
        res.json({ success: true, message: 'register successfully' });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        res.json(`something is missing from input field`);
    }
    try {
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid password" });
        }
        res.json({ success: true, message: "Login successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
};
exports.login = login;
const findUser = async (_req, res) => {
    try {
        const users = await User_1.UserSave.find().sort({ _id: -1 }); // Fetch all users
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        res.status(200).json({
            success: true,
            data: users, // includes _id automatically
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.findUser = findUser;
const DataSave = async (req, res) => {
    const { url, name } = req.body;
    if (!url || !name) {
        return res
            .status(400)
            .json({ success: false, message: "URL or Name missing" });
    }
    try {
        const existing = await User_1.UserSave.findOne({ name });
        if (existing) {
            const isSame = await bcryptjs_1.default.compare(url, existing.url);
            if (isSame) {
                return res
                    .status(400)
                    .json({ success: false, message: "URL already exists for this user" });
            }
        }
        const hashPassword = await bcryptjs_1.default.hash(url, 12);
        const newData = await User_1.UserSave.create({ url: hashPassword, name });
        res.status(201).json({
            success: true,
            message: "Data saved successfully",
            data: newData,
        });
    }
    catch (error) {
        console.error("Save error:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
exports.DataSave = DataSave;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is missing" });
    }
    try {
        // Convert string id to ObjectId
        const objectId = mongoose_1.Types.ObjectId.isValid(id) ? new mongoose_1.Types.ObjectId(id) : null;
        if (!objectId) {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
        const user = await User_1.UserSave.findById(objectId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await User_1.UserSave.deleteOne({ _id: objectId });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, url } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID missing" });
    }
    try {
        const updatedUser = await User_1.UserSave.findByIdAndUpdate(id, { name, url }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Update Error:", error);
        res.json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updateUser = updateUser;
