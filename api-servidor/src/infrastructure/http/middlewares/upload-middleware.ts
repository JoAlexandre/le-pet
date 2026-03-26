import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../shared/errors';

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 10MB
const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50MB (15s video)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'/* , 'image/webp' */];
const ALLOWED_VIDEO_TYPES = ['video/mp4'/* , 'video/quicktime' */];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: VIDEO_MAX_SIZE,
    files: 3,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      cb(
        new DomainError(
          `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_TYPES.join(', ')}`,
          400,
        ),
      );
      return;
    }
    cb(null, true);
  },
});

export function uploadLostAnimalMedia(req: Request, res: Response, next: NextFunction): void {
  const uploadHandler = upload.array('files', 3);

  uploadHandler(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new DomainError('File too large. Images max 10MB, videos max 50MB', 400));
        return;
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        next(new DomainError('Maximum of 3 files per post (2 photos + 1 video)', 400));
        return;
      }
      next(new DomainError(err.message, 400));
      return;
    }
    if (err) {
      next(err);
      return;
    }

    // Validar tamanho individual por tipo
    const files = (req.files as Express.Multer.File[]) || [];
    for (const file of files) {
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
      if (isImage && file.size > IMAGE_MAX_SIZE) {
        next(new DomainError(`Image ${file.originalname} exceeds 10MB limit`, 400));
        return;
      }
    }

    // Validar contagem: max 2 fotos + 1 video
    const photos = files.filter((f) => ALLOWED_IMAGE_TYPES.includes(f.mimetype));
    const videos = files.filter((f) => ALLOWED_VIDEO_TYPES.includes(f.mimetype));

    if (photos.length > 2) {
      next(new DomainError('Maximum of 2 photos per post', 400));
      return;
    }
    if (videos.length > 1) {
      next(new DomainError('Maximum of 1 video per post', 400));
      return;
    }

    next();
  });
}

export { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES };
