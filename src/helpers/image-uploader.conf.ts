import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

type validFileExtensions = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const validFileExtensions: validFileExtensions[] = ['png', 'jpg', 'jpeg'];
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
      console.log('file successfully passed');
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log('filter');
    validMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};
