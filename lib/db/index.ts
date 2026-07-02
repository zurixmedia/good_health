import { prisma } from "./prisma";

export const db = prisma;

export default db;

export {
  createNotification,
  createNotifications,
  createAuditLog,
  getUserWithProfile,
  findActiveSubscription,
  isSlotAvailable,
} from "./utils";
