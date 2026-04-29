"use client";

import type { UploadResult } from "@/types/nemodrop";

export const UPLOAD_HISTORY_EVENT = "nemodrop-upload-history-change";

const LEGACY_STORAGE_KEY = "quickdrop.uploadHistory.v1";
const STORAGE_KEY = "nemodrop.uploadHistory.v1";
const MAX_HISTORY_ITEMS = 10;

export interface UploadHistoryItem {
  code: string;
  kind: UploadResult["kind"];
  expiresAt: string;
  savedAt: string;
  title: string;
  detail: string;
  totalSize: number;
  fileCount?: number;
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
    typeof item.totalSize === "number" &&
    (typeof item.fileCount === "undefined" || typeof item.fileCount === "number")
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
      title: result.text.title || "",
      detail: "text",
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
    detail: "file",
    totalSize: result.files.reduce((sum, file) => sum + file.size, 0),
    fileCount,
  };
}

export function getUploadHistory(): UploadHistoryItem[] {
  if (!canUseStorage()) return [];

  try {
    const rawItems =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY) ||
      "[]";
    const parsed = JSON.parse(rawItems);
    const items = Array.isArray(parsed)
      ? parsed.filter(isUploadHistoryItem).filter(isActive)
      : [];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);

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
