import { db } from "./db";
import { insights, type InsertInsight, type UpdateInsightRequest, type Insight } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getInsights(): Promise<Insight[]>;
  getInsight(id: number): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  updateInsight(id: number, updates: UpdateInsightRequest): Promise<Insight>;
  deleteInsight(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getInsights(): Promise<Insight[]> {
    return await db.select().from(insights);
  }

  async getInsight(id: number): Promise<Insight | undefined> {
    const [insight] = await db.select().from(insights).where(eq(insights.id, id));
    return insight;
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const [created] = await db.insert(insights).values(insight).returning();
    return created;
  }

  async updateInsight(id: number, updates: UpdateInsightRequest): Promise<Insight> {
    const [updated] = await db
      .update(insights)
      .set(updates)
      .where(eq(insights.id, id))
      .returning();
    return updated;
  }

  async deleteInsight(id: number): Promise<void> {
    await db.delete(insights).where(eq(insights.id, id));
  }
}

export const storage = new DatabaseStorage();
