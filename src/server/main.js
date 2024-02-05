import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import ViteExpress from "vite-express";
import logger from "morgan";

const PORT = 8080;
const index = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../", "index.html");

const app = express();

app.use(logger("short"));

app.get("/", (request, response) => {
    response.sendFile(index);
});

app.post("/", (request, response) => {
    return response.send("File uploaded");
});

ViteExpress.listen(app, PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
