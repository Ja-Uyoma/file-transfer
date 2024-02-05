import express from "express";
import logger from "morgan";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PORT = 8080;
const index = path.join(path.dirname(fileURLToPath(import.meta.url)), "../", "index.html");

const app = express();

app.use(logger("short"));

app.get("/", (request, response) => {
    response.sendFile(index);
});

app.post("/", (request, response) => {
    return response.send("File uploaded");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});