"use client";

import { useState, useCallback } from "react";
import type { UploadResult, UploadProgress } from "@/types/quickdrop";

interface UseUploadReturn {
  upload: (files: File[], expiryMinutes: number) => Promise<UploadResult>;
  progress: UploadProgress | null;
  isUploading: boolean;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const reset = useCallback(() => {
    setProgress(null);
    setIsUploading(false);
  }, []);

  const upload = useCallback(
    (files: File[], expiryMinutes: number): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress({
              percent: Math.round((e.loaded / e.total) * 100),
              loaded: e.loaded,
              total: e.total,
            });
          }
        });

        xhr.addEventListener("load", () => {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText) as UploadResult;
              resolve(data);
            } catch {
              reject(new Error("Invalid server response"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || "Upload failed"));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => {
          setIsUploading(false);
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          setIsUploading(false);
          reject(new Error("Upload aborted"));
        });

        setIsUploading(true);
        setProgress({ percent: 0, loaded: 0, total: 0 });
        xhr.open("POST", "/api/upload");
        xhr.setRequestHeader("X-Expiry-Minutes", String(expiryMinutes));
        xhr.send(formData);
      });
    },
    [],
  );

  return { upload, progress, isUploading, reset };
}
