"use client";

import { useLocale, useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TermsConsent from "@/components/upload/TermsConsent";
import { MAX_TEXT_BYTES, MAX_TEXT_BYTES_LABEL } from "@/lib/config";
import { formatBytes } from "@/lib/format";
import {
  formatUploadExpiryMinutes,
  MAX_UPLOAD_EXPIRY_MINUTES,
  MIN_UPLOAD_EXPIRY_MINUTES,
  UPLOAD_EXPIRY_STEP_MINUTES,
} from "@/lib/upload-expiry";

interface TextUploadFormProps {
  title: string;
  content: string;
  expiryMinutes: number;
  isUploading: boolean;
  termsAccepted: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onExpiryChange: (minutes: number) => void;
  onTermsAcceptedChange: (accepted: boolean) => void;
  onUpload: () => void;
  onReset: () => void;
}

export default function TextUploadForm({
  title,
  content,
  expiryMinutes,
  isUploading,
  termsAccepted,
  onTitleChange,
  onContentChange,
  onExpiryChange,
  onTermsAcceptedChange,
  onUpload,
  onReset,
}: TextUploadFormProps) {
  const locale = useLocale();
  const t = useTranslations("TextUpload");
  const textSize = new TextEncoder().encode(content).length;
  const isTooLarge = textSize > MAX_TEXT_BYTES;
  const canUpload =
    content.trim().length > 0 && !isUploading && !isTooLarge && termsAccepted;
  const duration = formatUploadExpiryMinutes(expiryMinutes, locale);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t("title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("description", { maxSize: MAX_TEXT_BYTES_LABEL })}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isUploading}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          {t("reset")}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="text-title" className="text-sm font-medium">
          {t("titleLabel")}
        </label>
        <input
          id="text-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t("titlePlaceholder")}
          maxLength={80}
          disabled={isUploading}
          className="h-11 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="text-content" className="text-sm font-medium">
            {t("contentLabel")}
          </label>
          <span className="text-xs text-muted-foreground">
            {formatBytes(textSize)}
            {isTooLarge ? t("contentLimit", { maxSize: MAX_TEXT_BYTES_LABEL }) : ""}
          </span>
        </div>
        <textarea
          id="text-content"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={t("contentPlaceholder")}
          disabled={isUploading}
          className="min-h-60 rounded-md border bg-background px-3 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="rounded-lg border bg-background/70 px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{t("expiryTitle")}</p>
            <p className="text-xs text-muted-foreground">
              {t("expiryDescription", { duration })}
            </p>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-sm font-semibold">
            {duration}
          </span>
        </div>

        <input
          type="range"
          min={MIN_UPLOAD_EXPIRY_MINUTES}
          max={MAX_UPLOAD_EXPIRY_MINUTES}
          step={UPLOAD_EXPIRY_STEP_MINUTES}
          value={expiryMinutes}
          onChange={(event) => onExpiryChange(Number(event.target.value))}
          disabled={isUploading}
          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
          aria-label={t("expiryAria")}
        />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{t("minDuration")}</span>
          <span>{t("maxDuration")}</span>
        </div>
      </div>

      <TermsConsent
        checked={termsAccepted}
        disabled={isUploading}
        onCheckedChange={onTermsAcceptedChange}
      />

      <Button onClick={onUpload} disabled={!canUpload} className="w-full" size="lg">
        {isUploading ? t("uploading") : t("submit")}
      </Button>
    </div>
  );
}
