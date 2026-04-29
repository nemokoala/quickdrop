"use client";

import { useCallback, useState } from "react";
import type { UploadProgress, UploadResult } from "@/types/nemodrop";

interface UseUploadReturn {
  uploadFiles: (files: File[], expiryMinutes: number) => Promise<UploadResult>;
  uploadText: (
    content: string,
    title: string,
    expiryMinutes: number,
  ) => Promise<UploadResult>;
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

  const uploadFiles = useCallback(
    (files: File[], expiryMinutes: number): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (!event.lengthComputable) return;

          setProgress({
            percent: Math.round((event.loaded / event.total) * 100),
            loaded: event.loaded,
            total: event.total,
          });
        });

        xhr.addEventListener("load", () => {
          setIsUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText) as UploadResult);
            } catch {
              reject(new Error("Invalid server response"));
            }
            return;
          }

          if (xhr.status === 413) {
            reject(new Error("UPLOAD_TOO_LARGE"));
            return;
          }

          try {
            const error = JSON.parse(xhr.responseText) as {
              code?: string;
              error?: string;
            };
            if (error.code === "UPLOAD_TOO_LARGE") {
              reject(new Error("UPLOAD_TOO_LARGE"));
              return;
            }

            reject(new Error(error.error || "Upload failed"));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
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

  const uploadText = useCallback(
    async (
      content: string,
      title: string,
      expiryMinutes: number,
    ): Promise<UploadResult> => {
      setIsUploading(true);
      setProgress(null);

      try {
        const response = await fetch("/api/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            title,
            expiryMinutes,
          }),
        });

        const payload = (await response.json()) as UploadResult & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Text upload failed");
        }

        return payload;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error("Network error during upload");
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return { uploadFiles, uploadText, progress, isUploading, reset };
}
