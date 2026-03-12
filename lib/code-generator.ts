import { prisma } from "@/lib/prisma";

function randomCode(): string {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return String(num);
}

export async function generateUniqueCode(): Promise<string> {
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const code = randomCode();
    const existing = await prisma.session.findFirst({
      where: { code, expiresAt: { gt: now } },
    });
    if (!existing) return code;
  }
  throw new Error("Failed to generate unique code after 10 attempts");
}
