export type SessionKind = "file" | "text";

export interface FileInfo {
  id: number;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface TextInfo {
  title: string;
  content: string;
  size: number;
}

export interface SessionInfo {
  code: string;
  kind: SessionKind;
  createdAt: string;
  expiresAt: string;
  files: FileInfo[];
  text: TextInfo | null;
}

export interface UploadResult {
  code: string;
  kind: SessionKind;
  expiresAt: string;
  files: FileInfo[];
  text: TextInfo | null;
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}
