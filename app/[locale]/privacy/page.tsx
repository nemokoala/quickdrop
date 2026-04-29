import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface LegalPageProps {
  params: Promise<{ locale: string }>;
}

type LegalSection = {
  title: string;
  body: string[];
};

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });
  const sections = t.raw("sections") as LegalSection[];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-5 py-12">
      <div>
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("backHome")}
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("updatedAt")}</p>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
