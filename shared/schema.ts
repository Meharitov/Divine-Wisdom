import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  topic: text("topic"),
  content: text("content").notNull(),
  bibleVerse: text("bible_verse").notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInsightSchema = createInsertSchema(insights).omit({ id: true, createdAt: true });

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

export type GenerateInsightRequest = {
  topic?: string;
};
export type UpdateInsightRequest = Partial<InsertInsight>;
