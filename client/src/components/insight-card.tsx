import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Trash2, Quote } from "lucide-react";
import { useUpdateInsight, useDeleteInsight } from "@/hooks/use-insights";
import type { Insight } from "@shared/schema";

interface InsightCardProps {
  insight: Insight;
  delay?: number;
  highlighted?: boolean;
}

export function InsightCard({ insight, delay = 0, highlighted = false }: InsightCardProps) {
  const updateMutation = useUpdateInsight();
  const deleteMutation = useDeleteInsight();

  const handleToggleSave = () => {
    updateMutation.mutate({
      id: insight.id,
      isSaved: !insight.isSaved,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this reflection?")) {
      deleteMutation.mutate(insight.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={`relative group overflow-hidden rounded-xl bg-card p-8 shadow-sm 
        border transition-all duration-500
        ${highlighted 
          ? "border-primary/40 shadow-[0_8px_40px_rgb(180,140,80,0.1)]" 
          : "border-border/50 hover:border-primary/30 hover:shadow-md"
        }
      `}
    >
      {/* Decorative top accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${highlighted ? "bg-primary/60" : "bg-primary/20"} transition-colors group-hover:bg-primary/40`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 text-primary/60">
          <Quote className="w-5 h-5" />
          {insight.topic && (
            <span className="text-sm font-display tracking-wider uppercase text-muted-foreground">
              {insight.topic}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleSave}
            disabled={updateMutation.isPending}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            title={insight.isSaved ? "Remove from saved" : "Save reflection"}
          >
            {insight.isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            title="Delete reflection"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-foreground/90 font-body text-lg leading-relaxed whitespace-pre-wrap">
          {insight.content}
        </p>

        <div className="pt-6 border-t border-border/50 flex flex-col items-end">
          <span className="font-display italic text-lg text-primary/80">
            {insight.bibleVerse}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
