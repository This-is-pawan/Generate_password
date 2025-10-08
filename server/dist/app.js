"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = __importDefault(require("./db/mongodb"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const cors_1 = __importDefault(require("cors"));
(0, mongodb_1.default)();
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/Auth", AuthRoute_1.default);
app.get("/", (req, res) => {
    res.json("Home Route Is Working");
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
