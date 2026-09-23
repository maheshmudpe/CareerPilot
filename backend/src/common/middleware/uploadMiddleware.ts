import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const uploadDirectory = path.resolve(
    process.cwd(),
    "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({

    destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (_req, file, cb) => {

        const uniqueName =
            `${crypto.randomUUID()}-${file.originalname}`;

        cb(null, uniqueName);
    },

});


export const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});