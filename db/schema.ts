import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: serial().primaryKey(),
  name: text().notNull(),
  business: text().notNull(),
  email: text().notNull(),
  budget: text().notNull(),
  message: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
