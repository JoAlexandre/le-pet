export interface UploadedFile {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface FileStorageProvider {
  upload(file: Buffer, fileName: string, mimeType: string): Promise<UploadedFile>;
  delete(fileUrl: string): Promise<void>;
  getPublicUrl(fileName: string): string;
}
