export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatExpiry(expiresAt: string, locale = "ko"): string {
  const diff = new Date(expiresAt).getTime() - Date.now();

  if (diff <= 0) {
    return locale === "en" ? "Expired" : "만료됨";
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (locale === "en") {
    if (hours > 0) return `Expires in ${hours}h ${minutes}m`;
    return `Expires in ${minutes}m`;
  }

  if (hours > 0) return `${hours}시간 ${minutes}분 후 만료`;

  return `${minutes}분 후 만료`;
}
