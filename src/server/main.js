import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

import express from "express";
import ViteExpress from "vite-express";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";

import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");
}
catch (err) {
    console.error("Unable to connect to the database:", err);
}

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

await User.sync();

const app = express();
const PORT = process.env.PORT || 8080;
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../dist");
const uploadsDir = path.join(publicDir, "../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

passport.use(new LocalStrategy(async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }

        if (user.password !== password) {
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});

app.use(cors());
app.use(logger("dev"));
app.use(express.static(distDir));
app.use(express.json());
app.use(fileUpload());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request, response) => {
    response.sendFile(path.join(publicDir, "../index.html"));
});

app.get("/sign-up", (request, response) => {
    response.sendFile(path.join(publicDir, "../src/client/sign-up.html"));
});

app.post("/sign-up", async (request, response, next) => {
    const { email, password } = request.body;

    try {
        if (!email || !password) {
            return response.status(400).send("Email and password are required");
        }

        const user = await User.create({email, password});
        await user.save();
        response.redirect("/");
    }
    catch (err) {
        console.error("Error registering user: ", err);
        return next(err);
    }
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
