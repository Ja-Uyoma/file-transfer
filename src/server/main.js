import { fileURLToPath } from "node:url";
import path from "node:path";

import express from "express";
import ViteExpress from "vite-express";
import logger from "morgan";
import fileUpload from "express-fileupload";

const app = express();
const PORT = 8080;
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const uploadsDir = path.join(publicDir, "uploads");

app.use(logger("short"));
app.use(express.static(publicDir));

app.use(fileUpload());

app.get("/", (request, response) => {
    response.sendFile(path.join(publicDir, "../index.html"));
});

app.post("/upload", (request, response) => {
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send("No files were uploaded");
    }

    const uploadedFile = request.files.file;
    uploadedFile.mv(path.join(uploadsDir, uploadedFile.name), (err) => {
        if (err) {
            return response.status(500).send(err);
        }

        response.json({ success: true, message: "File uploaded successfully!" });
    });
});

ViteExpress.listen(app, PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
