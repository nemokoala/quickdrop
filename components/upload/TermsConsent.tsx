"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import LegalContent, { type LegalSection } from "@/components/legal/LegalContent";

type LegalModal = "terms" | "privacy";

interface TermsConsentProps {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function LegalModalContent({ type }: { type: LegalModal }) {
  const locale = useLocale();
  const namespace = type === "terms" ? "TermsPage" : "PrivacyPage";
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as LegalSection[];

  return (
    <>
      <DialogTitle className="sr-only">{t("title")}</DialogTitle>
      <LegalContent
        title={t("title")}
        updatedAt={t("updatedAt")}
        sections={sections}
        fullPageHref={`/${locale}/${type}`}
        fullPageLabel={locale === "ko" ? "전체 페이지로 열기" : "Open full page"}
        scrollable
      />
    </>
  );
}

export default function TermsConsent({
  checked,
  disabled = false,
  onCheckedChange,
}: TermsConsentProps) {
  const t = useTranslations("LegalConsent");
  const [openModal, setOpenModal] = useState<LegalModal | null>(null);

  const openLegalModal = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: LegalModal,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenModal(type);
  };

  return (
    <>
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
              <button
                type="button"
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={(event) => openLegalModal(event, "terms")}
              >
                {chunks}
              </button>
            ),
            privacy: (chunks) => (
              <button
                type="button"
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={(event) => openLegalModal(event, "privacy")}
              >
                {chunks}
              </button>
            ),
          })}
        </span>
      </label>

      <Dialog
        open={openModal !== null}
        onOpenChange={(open) => !open && setOpenModal(null)}
      >
        <DialogContent className="max-w-2xl">
          {openModal && <LegalModalContent type={openModal} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
