import { diskStorage } from 'multer';
import { Request } from 'express';
import { extname } from 'node:path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename(
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${name}-${randomName}${extension}`);
    },
  }),
};
