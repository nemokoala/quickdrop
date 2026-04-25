import { BASE_URL } from "@/lib/config";

type DiscordLogEvent =
  | {
      type: "upload";
      code: string;
      kind: "file";
      fileCount: number;
      totalSize: number;
      expiresAt: Date;
      files: Array<{
        originalName: string;
        size: number;
        mimeType: string;
      }>;
      request: RequestLogContext;
    }
  | {
      type: "upload";
      code: string;
      kind: "text";
      title: string;
      size: number;
      expiresAt: Date;
      request: RequestLogContext;
    }
  | {
      type: "download";
      code: string;
      mode: "single";
      fileName: string;
      size: number;
      mimeType: string;
      request: RequestLogContext;
    }
  | {
      type: "download";
      code: string;
      mode: "zip";
      fileCount: number;
      totalSize: number;
      request: RequestLogContext;
    };

interface RequestLogContext {
  ip: string;
  userAgent: string;
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export function getRequestLogContext(req: Request): RequestLogContext {
  return {
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  };
}

export async function sendDiscordLog(event: DiscordLogEvent): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!WEBHOOK_URL) {
    return;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildDiscordPayload(event)),
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      console.warn("[discord-webhook] log delivery failed:", response.status);
    }
  } catch (err) {
    console.warn("[discord-webhook] log delivery error:", err);
  }
}

function buildDiscordPayload(event: DiscordLogEvent) {
  const isUpload = event.type === "upload";
  const title = isUpload ? "QuickDrop upload" : "QuickDrop download";
  const color = isUpload ? 0x22c55e : 0x3b82f6;
  const fields: DiscordEmbedField[] = [
    { name: "Code", value: event.code, inline: true },
    { name: "IP", value: event.request.ip, inline: true },
    { name: "User-Agent", value: truncate(event.request.userAgent, 300) },
  ];

  if (event.type === "upload" && event.kind === "file") {
    fields.splice(
      1,
      0,
      { name: "Type", value: "files", inline: true },
      { name: "Files", value: String(event.fileCount), inline: true },
      { name: "Total size", value: formatBytes(event.totalSize), inline: true },
      { name: "Expires", value: event.expiresAt.toISOString(), inline: true },
    );
    fields.push({
      name: "File list",
      value: truncate(
        event.files
          .map(
            (file) =>
              `${file.originalName} (${formatBytes(file.size)}, ${file.mimeType})`,
          )
          .join("\n"),
        1000,
      ),
    });
  }

  if (event.type === "upload" && event.kind === "text") {
    fields.splice(
      1,
      0,
      { name: "Type", value: "text", inline: true },
      { name: "Title", value: truncate(event.title, 200), inline: true },
      { name: "Size", value: formatBytes(event.size), inline: true },
      { name: "Expires", value: event.expiresAt.toISOString(), inline: true },
    );
  }

  if (event.type === "download" && event.mode === "single") {
    fields.splice(
      1,
      0,
      { name: "Mode", value: "single file", inline: true },
      { name: "File", value: truncate(event.fileName, 200), inline: true },
      { name: "Size", value: formatBytes(event.size), inline: true },
      { name: "MIME", value: event.mimeType || "unknown", inline: true },
    );
  }

  if (event.type === "download" && event.mode === "zip") {
    fields.splice(
      1,
      0,
      { name: "Mode", value: "zip", inline: true },
      { name: "Files", value: String(event.fileCount), inline: true },
      { name: "Total size", value: formatBytes(event.totalSize), inline: true },
    );
  }

  return {
    username: "QuickDrop",
    embeds: [
      {
        title,
        url: `${BASE_URL.replace(/\/$/, "")}/d/${event.code}`,
        color,
        timestamp: new Date().toISOString(),
        fields,
      },
    ],
  };
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${Number(value.toFixed(1))} ${units[exponent]}`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}
