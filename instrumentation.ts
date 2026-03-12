export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { cleanupExpiredSessions } = await import("@/lib/cleanup");

    // 매시간 만료 파일 자동 정리
    cron.schedule("0 * * * *", async () => {
      try {
        const count = await cleanupExpiredSessions();
        if (count > 0) {
          console.log(`[cleanup] Deleted ${count} expired session(s)`);
        }
      } catch (err) {
        console.error("[cleanup] cron error:", err);
      }
    });

    console.log("[quickdrop] Cleanup cron registered (every hour)");
  }
}
