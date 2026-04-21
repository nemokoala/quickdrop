import path from "path";

// ============================================================
// QuickDrop 설정
// 여기 값을 바꾸면 업로드/공유 동작 전반에 반영됩니다.
// ============================================================

/** 파일당 최대 업로드 크기 (bytes). 기본값 5GB */
export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 * 1024;

/** MAX_FILE_SIZE를 사람이 읽기 쉬운 문자열로 표시할 때 사용 */
export const MAX_FILE_SIZE_LABEL = process.env.MAX_FILE_SIZE_LABEL || "5GB";

/** 세션 만료 시간 (시간 단위). 기본값 24시간 */
export const SESSION_EXPIRY_HOURS =
  Number(process.env.SESSION_EXPIRY_HOURS) || 24;

/** 업로드 파일이 저장되는 디렉터리 */
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

/** 서비스 기본 URL (QR 코드/공유 링크 생성에 사용) */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/** 공유 코드 길이 */
export const CODE_LENGTH = 6;

/** 텍스트 공유 최대 크기 (bytes). 기본값 100KB */
export const MAX_TEXT_BYTES =
  Number(process.env.MAX_TEXT_BYTES) || 100 * 1024;

/** MAX_TEXT_BYTES를 사람이 읽기 쉬운 문자열로 표시할 때 사용 */
export const MAX_TEXT_BYTES_LABEL =
  process.env.MAX_TEXT_BYTES_LABEL || "100 KB";
