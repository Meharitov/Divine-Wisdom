import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.insights.list.path, async (req, res) => {
    try {
      const insights = await storage.getInsights();
      res.json(insights);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.post(api.insights.generate.path, async (req, res) => {
    try {
      const { topic } = api.insights.generate.input.parse(req.body);
      
      let prompt = "Generate a profound, Bible-based philosophical idea or insight. Include a relevant Bible verse that supports this idea. Format the response as JSON with two fields: 'content' (the philosophical idea, 2-3 paragraphs) and 'bibleVerse' (the reference and text of the verse).";
      
      if (topic) {
        prompt = `Generate a profound, Bible-based philosophical idea or insight about the following topic: "${topic}". Include a relevant Bible verse that supports this idea. Format the response as JSON with two fields: 'content' (the philosophical idea, 2-3 paragraphs) and 'bibleVerse' (the reference and text of the verse).`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // fallback or typical available model
        messages: [
          { role: "system", content: "You are a thoughtful theologian and philosopher who draws deep insights from biblical texts. You provide wisdom that is grounding, contemplative, and spiritually rich." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const resultText = response.choices[0]?.message?.content || "{}";
      const resultObj = JSON.parse(resultText);

      if (!resultObj.content || !resultObj.bibleVerse) {
        throw new Error("Invalid response format from AI");
      }

      const insight = await storage.createInsight({
        topic: topic || null,
        content: resultObj.content,
        bibleVerse: resultObj.bibleVerse,
        isSaved: false,
      });

      res.status(201).json(insight);
    } catch (err) {
      console.error("Error generating insight:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message || "Validation error",
          field: err.errors[0]?.path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate insight" });
    }
  });

  app.put(api.insights.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const updates = api.insights.update.input.parse(req.body);
      const existing = await storage.getInsight(id);
      
      if (!existing) {
        return res.status(404).json({ message: "Insight not found" });
      }

      const updated = await storage.updateInsight(id, updates);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message || "Validation error",
          field: err.errors[0]?.path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to update insight" });
    }
  });

  app.delete(api.insights.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const existing = await storage.getInsight(id);
      if (!existing) {
        return res.status(404).json({ message: "Insight not found" });
      }

      await storage.deleteInsight(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete insight" });
    }
  });

  return httpServer;
}
