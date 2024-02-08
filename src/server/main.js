import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

import express from "express";
import ViteExpress from "vite-express";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();
const PORT = 8080;
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const uploadsDir = path.join(publicDir, "../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(logger("short"));
app.use(express.static(publicDir));
app.use(express.json());

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

app.delete("/delete-file", (req, res) => {
    const filename = req.body.filename;

    if (!filename) {
        return res.status(400).send("Filename not provided");
    }

    // Delete the file from the server
    fs.unlink(path.join(uploadsDir, "/", filename), (err) => {
        if (err) {
            console.error("Error deleting file: ", err);
            res.status(500).send("Error deleting file");
        }
        else {
            console.log("File deleted successfully");
            res.send("File deleted successfully");
        }
    });
});

app.get("/get-existing-files", (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const existingFiles = files.map(file => ({
            name: file,
            size: fs.statSync(path.join(uploadsDir, file)).size,
            url: `/uploads/${file}`,
            type: path.extname(file)
        }));

        res.json(existingFiles);
    }
    catch (error) {
        console.error("Error retrieving existing files:", error);
        res.status(500).send("Internal server error");
    }
});

ViteExpress.listen(app, PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
