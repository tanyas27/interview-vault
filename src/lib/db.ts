import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('neon.tech')) {
    const { neon } = require('@neondatabase/serverless');
    const { PrismaNeon } = require('@prisma/adapter-neon');
    const sql = neon(process.env.DATABASE_URL!);
    const adapter = new PrismaNeon(sql);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
