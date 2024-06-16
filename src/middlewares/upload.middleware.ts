import multer from "multer";
import { Request, Response, NextFunction } from "express";
// import { handleMulterError } from "./errorHandler";

// Define the file types allowed for upload
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/uploads/images"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({ storage, fileFilter });

// Interface for uploaded file details
interface UploadedFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

// Middleware function for handling image uploads
export const uploadImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array("images", 10)(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors
      return console.error(err);
      // return handleMulterError(err, res);
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: "Internal server error" });
    }

    // Handle successful uploads
    // const uploadedFiles = req.files as  Express.Multer.File[];
    // ?.map(
    //   (file: Express.Multer.File) => ({
    //     filename: file.filename,
    //     path: file.path,
    //     mimetype: file.mimetype,
    //     size: file.size,
    //   })
    // );

    // Attach the uploaded files to the request object
    // req.uploadedFiles = uploadedFiles;

    // Call the next middleware or route handler
    next();
  });
};
