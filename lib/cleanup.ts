import { prisma } from "@/lib/prisma";
import { deleteSessionDir } from "@/lib/storage";

export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  const expired = await prisma.session.findMany({
    where: { expiresAt: { lt: now } },
    select: { code: true },
  });

  for (const session of expired) {
    await deleteSessionDir(session.code);
  }

  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  return result.count;
}
