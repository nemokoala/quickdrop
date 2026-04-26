export const MIN_UPLOAD_EXPIRY_MINUTES = 30;
export const MAX_UPLOAD_EXPIRY_MINUTES = 180;
export const UPLOAD_EXPIRY_STEP_MINUTES = 30;
export const DEFAULT_UPLOAD_EXPIRY_MINUTES = 60;

export function clampUploadExpiryMinutes(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_UPLOAD_EXPIRY_MINUTES;

  const stepped =
    Math.round(value / UPLOAD_EXPIRY_STEP_MINUTES) * UPLOAD_EXPIRY_STEP_MINUTES;

  return Math.min(
    MAX_UPLOAD_EXPIRY_MINUTES,
    Math.max(MIN_UPLOAD_EXPIRY_MINUTES, stepped),
  );
}

export function parseUploadExpiryMinutes(value: string | null): number {
  if (!value) return DEFAULT_UPLOAD_EXPIRY_MINUTES;

  return clampUploadExpiryMinutes(Number(value));
}

export function formatUploadExpiryMinutes(
  minutes: number,
  locale = "ko",
): string {
  const safeMinutes = clampUploadExpiryMinutes(minutes);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (locale === "en") {
    if (hours === 0) return `${remainingMinutes} min`;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours === 0) return `${remainingMinutes}분`;
  if (remainingMinutes === 0) return `${hours}시간`;

  return `${hours}시간 ${remainingMinutes}분`;
}
