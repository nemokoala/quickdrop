import path from "path";

// ============================================================
// QuickDrop Configuration - 여기 값 하나만 바꾸면 전체 적용됨
// 환경변수로 오버라이드 가능
// ============================================================

/** 파일당 최대 크기 (bytes). 기본 5GB */
export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 * 1024;

/** MAX_FILE_SIZE를 사람이 읽기 좋은 문자열로 */
export const MAX_FILE_SIZE_LABEL = process.env.MAX_FILE_SIZE_LABEL || "5GB";

/** 세션 만료 시간 (시간 단위). 기본 24시간 */
export const SESSION_EXPIRY_HOURS =
  Number(process.env.SESSION_EXPIRY_HOURS) || 24;

/** 파일 저장 디렉토리 */
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

/** 앱 베이스 URL (QR 코드 생성에 사용). LAN IP로 변경 필요 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/** 공유 코드 길이 */
export const CODE_LENGTH = 6;
