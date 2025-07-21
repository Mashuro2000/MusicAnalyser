import express, { NextFunction, Request, Response } from "express";
import genius from "./routes/genius"
import spotify from "./routes/spotify"
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use('/genius', genius);
app.use('/spotify', spotify);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});

app.listen(PORT, '0.0.0.0', () => {

});