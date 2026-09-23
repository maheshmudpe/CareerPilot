import multer from "multer";

const storage = multer.diskStorage({

    destination: "./uploads",
    filename: (_req, file, cb) => {
         const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
         cb(null , uniqueName)
    },

})



export const upload = multer({

    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})