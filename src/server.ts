import { App } from "./app";
import dotenv from "dotenv";

dotenv.config();

const app = new App();

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT);
