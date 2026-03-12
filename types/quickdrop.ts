export interface FileInfo {
  id: number;
  originalName: string;
  size: number; // bytes (BigInt serialized as number)
  mimeType: string;
}

export interface SessionInfo {
  code: string;
  createdAt: string;
  expiresAt: string;
  files: FileInfo[];
}

export interface UploadResult {
  code: string;
  expiresAt: string;
  files: FileInfo[];
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}
