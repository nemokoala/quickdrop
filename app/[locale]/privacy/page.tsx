import { getTranslations } from "next-intl/server";
import LegalContent, { type LegalSection } from "@/components/legal/LegalContent";

interface LegalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });
  const sections = t.raw("sections") as LegalSection[];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-5 py-12">
      <LegalContent
        title={t("title")}
        updatedAt={t("updatedAt")}
        sections={sections}
        backHref={`/${locale}`}
        backLabel={t("backHome")}
      />
    </main>
  );
}
