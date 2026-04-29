"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface TermsConsentProps {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function TermsConsent({
  checked,
  disabled = false,
  onCheckedChange,
}: TermsConsentProps) {
  const locale = useLocale();
  const t = useTranslations("LegalConsent");

  return (
    <label className="flex gap-3 rounded-lg border bg-background/70 px-4 py-3 text-sm leading-6">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
        aria-describedby="upload-legal-consent-description"
      />
      <span id="upload-legal-consent-description" className="text-muted-foreground">
        {t.rich("agreement", {
          terms: (chunks) => (
            <Link
              href={`/${locale}/terms`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href={`/${locale}/privacy`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </span>
    </label>
  );
}
