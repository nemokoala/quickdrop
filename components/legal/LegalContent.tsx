import Link from "next/link";

export type LegalSection = {
  title: string;
  body: string[];
};

interface LegalContentProps {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
  backHref?: string;
  backLabel?: string;
  fullPageHref?: string;
  fullPageLabel?: string;
  className?: string;
  scrollable?: boolean;
}

export default function LegalContent({
  title,
  updatedAt,
  sections,
  backHref,
  backLabel,
  fullPageHref,
  fullPageLabel,
  className = "",
  scrollable = false,
}: LegalContentProps) {
  return (
    <div
      className={[
        "flex flex-col gap-8",
        scrollable ? "thin-blue-scrollbar max-h-[70vh] overflow-y-auto" : "",
        className,
      ].join(" ")}
    >
      <div>
        {backHref && backLabel && (
          <Link
            href={backHref}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {backLabel}
          </Link>
        )}
        <h1
          className={
            backHref
              ? "mt-6 text-3xl font-bold tracking-tight"
              : "text-xl font-bold tracking-tight"
          }
        >
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{updatedAt}</p>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2
              className={
                backHref ? "text-xl font-semibold" : "text-base font-semibold"
              }
            >
              {section.title}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className={
                  backHref
                    ? "leading-7 text-muted-foreground"
                    : "text-sm leading-6 text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {fullPageHref && fullPageLabel && (
        <Link
          href={fullPageHref}
          target="_blank"
          rel="noreferrer"
          className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {fullPageLabel}
        </Link>
      )}
    </div>
  );
}
