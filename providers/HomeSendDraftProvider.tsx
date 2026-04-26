"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { DEFAULT_UPLOAD_EXPIRY_MINUTES } from "@/lib/upload-expiry";
import type { SessionKind, UploadResult } from "@/types/quickdrop";

interface HomeSendDraftContextValue {
  mode: SessionKind;
  setMode: Dispatch<SetStateAction<SessionKind>>;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  textTitle: string;
  setTextTitle: Dispatch<SetStateAction<string>>;
  textContent: string;
  setTextContent: Dispatch<SetStateAction<string>>;
  result: UploadResult | null;
  setResult: Dispatch<SetStateAction<UploadResult | null>>;
  expiryMinutes: number;
  setExpiryMinutes: Dispatch<SetStateAction<number>>;
  resetDraft: () => void;
}

const HomeSendDraftContext = createContext<HomeSendDraftContextValue | null>(
  null,
);

export function HomeSendDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<SessionKind>("file");
  const [files, setFiles] = useState<File[]>([]);
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [expiryMinutes, setExpiryMinutes] = useState(
    DEFAULT_UPLOAD_EXPIRY_MINUTES,
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      files,
      setFiles,
      textTitle,
      setTextTitle,
      textContent,
      setTextContent,
      result,
      setResult,
      expiryMinutes,
      setExpiryMinutes,
      resetDraft: () => {
        setFiles([]);
        setTextTitle("");
        setTextContent("");
        setResult(null);
        setExpiryMinutes(DEFAULT_UPLOAD_EXPIRY_MINUTES);
      },
    }),
    [expiryMinutes, files, mode, result, textContent, textTitle],
  );

  return (
    <HomeSendDraftContext.Provider value={value}>
      {children}
    </HomeSendDraftContext.Provider>
  );
}

export function useHomeSendDraft() {
  const context = useContext(HomeSendDraftContext);

  if (!context) {
    throw new Error(
      "useHomeSendDraft must be used within HomeSendDraftProvider",
    );
  }

  return context;
}
