import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Loader2, Feather, Bookmark } from "lucide-react";
import { useInsights, useGenerateInsight } from "@/hooks/use-insights";
import { InsightCard } from "@/components/insight-card";

export default function Home() {
  const [topic, setTopic] = useState("");
  const { data: insights = [], isLoading } = useInsights();
  const generateMutation = useGenerateInsight();

  // Sort insights: show newly generated first, then sort rest by creation
  const sortedInsights = [...insights].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const savedInsights = sortedInsights.filter(i => i.isSaved);
  const recentInsight = generateMutation.data; // Temporarily hold the generated one to highlight it

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate({ topic: topic.trim() || undefined });
    setTopic(""); // Clear input after submitting
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-4"
        >
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-5xl font-display text-foreground mb-4"
        >
          Divine Wisdom, <span className="italic text-primary/80">Modern Clarity</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-muted-foreground font-body text-lg max-w-xl mx-auto"
        >
          Seek philosophical guidance grounded in biblical text. Ask a question, provide a topic, or simply receive a daily reflection.
        </motion.p>
      </header>

      {/* Generator Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-2xl mx-auto px-4 mb-20"
      >
        <div className="glass-card p-6 md:p-10 rounded-2xl relative overflow-hidden">
          <form onSubmit={handleGenerate} className="relative z-10 flex flex-col items-center">
            <div className="w-full relative mb-8 group">
              <Feather className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is heavily weighing on your mind today?"
                className="elegant-input pl-12"
                disabled={generateMutation.isPending}
              />
            </div>
            
            <button 
              type="submit" 
              className="elegant-button flex items-center gap-2 group"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Seeking Wisdom...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                  Receive Insight
                </>
              )}
            </button>
          </form>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-4 space-y-24">
        {/* Recently Generated Insight */}
        <AnimatePresence>
          {recentInsight && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-display text-center text-primary/80 mb-8 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-primary/20"></span>
                A Reflection For You
                <span className="h-px w-12 bg-primary/20"></span>
              </h2>
              <InsightCard insight={recentInsight} highlighted={true} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Saved Insights */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-2xl font-display text-foreground">Saved Reflections</h3>
            <span className="text-sm font-body text-muted-foreground">
              {savedInsights.length} {savedInsights.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
          ) : savedInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedInsights.map((insight, index) => (
                <InsightCard 
                  key={insight.id} 
                  insight={insight} 
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4 bg-card/30 rounded-2xl border border-dashed border-border"
            >
              <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h4 className="text-lg font-display text-foreground mb-2">No Saved Reflections</h4>
              <p className="text-muted-foreground font-body">
                Insights you save will appear here for future contemplation.
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
