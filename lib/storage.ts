import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/config";

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function getSessionDir(code: string) {
  return path.join(UPLOAD_DIR, code);
}

export function getFilePath(code: string, storedName: string) {
  return path.join(UPLOAD_DIR, code, storedName);
}

export async function createSessionDir(code: string) {
  const dir = getSessionDir(code);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function deleteSessionDir(code: string) {
  const dir = getSessionDir(code);
  await fs.rm(dir, { recursive: true, force: true });
}
