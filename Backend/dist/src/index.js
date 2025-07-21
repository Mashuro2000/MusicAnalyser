"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genius_1 = __importDefault(require("./routes/genius"));
const spotify_1 = __importDefault(require("./routes/spotify"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/genius', genius_1.default);
app.use('/spotify', spotify_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the Node.js + TypeScript API!");
});
app.listen(PORT, '0.0.0.0', () => {
});
//# sourceMappingURL=index.js.map