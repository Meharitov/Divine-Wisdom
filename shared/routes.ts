import { z } from "zod";
import { insertInsightSchema, insights } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  insights: {
    list: {
      method: "GET" as const,
      path: "/api/insights" as const,
      responses: {
        200: z.array(z.custom<typeof insights.$inferSelect>()),
      },
    },
    generate: {
      method: "POST" as const,
      path: "/api/insights/generate" as const,
      input: z.object({
        topic: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof insights.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/insights/:id" as const,
      input: insertInsightSchema.partial(),
      responses: {
        200: z.custom<typeof insights.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/insights/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type GenerateInsightInput = z.infer<typeof api.insights.generate.input>;
export type InsightResponse = z.infer<typeof api.insights.generate.responses[201]>;
export type UpdateInsightInput = z.infer<typeof api.insights.update.input>;
