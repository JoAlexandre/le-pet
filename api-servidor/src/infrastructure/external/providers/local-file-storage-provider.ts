import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  FileStorageProvider,
  UploadedFile,
} from '../../../application/interfaces/file-storage-provider';
import { config } from '../../../shared/config';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

export class LocalFileStorageProvider implements FileStorageProvider {
  constructor() {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  async upload(file: Buffer, fileName: string, mimeType: string): Promise<UploadedFile> {
    const ext = path.extname(fileName);
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    await fs.promises.writeFile(filePath, file);

    const url = this.getPublicUrl(uniqueName);

    return {
      originalName: fileName,
      fileName: uniqueName,
      mimeType,
      size: file.length,
      url,
    };
  }

  async delete(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    const filePath = path.join(UPLOAD_DIR, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getPublicUrl(fileName: string): string {
    const baseUrl = config.upload.baseUrl || `http://localhost:${config.port}`;
    return `${baseUrl}/uploads/${fileName}`;
  }
}
