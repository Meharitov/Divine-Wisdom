import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GenerateInsightInput, type UpdateInsightInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch all insights
export function useInsights() {
  return useQuery({
    queryKey: [api.insights.list.path],
    queryFn: async () => {
      const res = await fetch(api.insights.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch insights");
      return api.insights.list.responses[200].parse(await res.json());
    },
  });
}

// Generate a new insight
export function useGenerateInsight() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateInsightInput) => {
      const res = await fetch(api.insights.generate.path, {
        method: api.insights.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 500) {
          const err = api.insights.generate.responses[500].parse(await res.json());
          throw new Error(err.message || "Failed to generate insight");
        }
        throw new Error("Failed to generate insight");
      }
      return api.insights.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.insights.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Update an insight (e.g., toggle saved status)
export function useUpdateInsight() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateInsightInput) => {
      const url = buildUrl(api.insights.update.path, { id });
      const res = await fetch(url, {
        method: api.insights.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update insight");
      return api.insights.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.insights.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Delete an insight
export function useDeleteInsight() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.insights.delete.path, { id });
      const res = await fetch(url, {
        method: api.insights.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete insight");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.insights.list.path] });
      toast({
        title: "Deleted",
        description: "The insight has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
