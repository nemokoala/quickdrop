"use client";

import type { UploadResult } from "@/types/quickdrop";

export const UPLOAD_HISTORY_EVENT = "quickdrop-upload-history-change";

const STORAGE_KEY = "quickdrop.uploadHistory.v1";
const MAX_HISTORY_ITEMS = 10;

export interface UploadHistoryItem {
  code: string;
  kind: UploadResult["kind"];
  expiresAt: string;
  savedAt: string;
  title: string;
  detail: string;
  totalSize: number;
}

function isUploadHistoryItem(value: unknown): value is UploadHistoryItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<UploadHistoryItem>;

  return (
    typeof item.code === "string" &&
    (item.kind === "file" || item.kind === "text") &&
    typeof item.expiresAt === "string" &&
    typeof item.savedAt === "string" &&
    typeof item.title === "string" &&
    typeof item.detail === "string" &&
    typeof item.totalSize === "number"
  );
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isActive(item: UploadHistoryItem) {
  return new Date(item.expiresAt).getTime() > Date.now();
}

function notifyHistoryChanged() {
  window.dispatchEvent(new Event(UPLOAD_HISTORY_EVENT));
}

function toHistoryItem(result: UploadResult): UploadHistoryItem {
  if (result.kind === "text" && result.text) {
    return {
      code: result.code,
      kind: result.kind,
      expiresAt: result.expiresAt,
      savedAt: new Date().toISOString(),
      title: result.text.title || "공유 텍스트",
      detail: "텍스트",
      totalSize: result.text.size,
    };
  }

  const fileCount = result.files.length;
  const firstFileName = result.files[0]?.originalName || "공유 파일";

  return {
    code: result.code,
    kind: result.kind,
    expiresAt: result.expiresAt,
    savedAt: new Date().toISOString(),
    title: firstFileName,
    detail: fileCount > 1 ? `파일 ${fileCount}개` : "파일 1개",
    totalSize: result.files.reduce((sum, file) => sum + file.size, 0),
  };
}

export function getUploadHistory(): UploadHistoryItem[] {
  if (!canUseStorage()) return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    const items = Array.isArray(parsed)
      ? parsed.filter(isUploadHistoryItem).filter(isActive)
      : [];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    return items;
  } catch {
    return [];
  }
}

export function saveUploadHistory(result: UploadResult) {
  if (!canUseStorage()) return;

  const nextItem = toHistoryItem(result);
  const nextItems = [
    nextItem,
    ...getUploadHistory().filter((item) => item.code !== result.code),
  ].slice(0, MAX_HISTORY_ITEMS);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  notifyHistoryChanged();
}

export function removeUploadHistoryItem(code: string) {
  if (!canUseStorage()) return;

  const nextItems = getUploadHistory().filter((item) => item.code !== code);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  notifyHistoryChanged();
}
