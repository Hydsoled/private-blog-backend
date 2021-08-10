import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const maxSize: number = 20 * 1024 * 1024; // 20MB
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];
export const saveImageToStorage = {
  storage: diskStorage({
    destination: './src/images',
    filename: (req, file, cb) => {
      const fileExtension: string = extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    validMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
  limits: {
    fileSize: maxSize,
  },
};
