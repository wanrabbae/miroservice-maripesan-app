import multer from "multer"

const maxSize = 5 * 1024 * 1024 // Max 5 MB
const filterFile = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize, 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

export default filterFile