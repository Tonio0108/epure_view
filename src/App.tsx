// 3. Épure
// Épure signifie "dessin à l'échelle d'une construction". C'est l'idée de nettoyer ton CV pour n'en garder que la structure parfaite.

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  BrainCircuit, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Zap,
  X,
  ArrowRight,
  ArrowUp,
  Target,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { analyzeResume } from "@/lib/api";

interface AnalysisResult {
  score: number;
  missingSkills: string[];
  suggestions: {
    original: string;
    suggestion: string;
    reason: string;
  }[];
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'error' | 'success' | 'info' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((title: string, message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setAlertModal({ isOpen: true, title, message, type });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const onDropRejected = useCallback(() => {
    showAlert("Erreur", "Fichier invalide. PDF uniquement, max 10MB.", "error");
  }, [showAlert]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    onDropRejected
  });

  const handleAnalyze = useCallback(async () => {
    if (!file || !jobDescription.trim()) {
      showAlert("Information", "Veuillez importer un CV et décrire l'offre d'emploi.", "info");
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeResume(file, jobDescription);
      setResult({
        score: data.score,
        missingSkills: JSON.parse(data.missingSkills),
        suggestions: JSON.parse(data.suggestions)
      });
      
      // Scroll immédiat vers les résultats (mobile only)
      if (window.innerWidth < 1024) {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'analyse";
      showAlert("Erreur", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [file, jobDescription, showAlert]);

  const handleReset = useCallback(() => {
    setFile(null);
    setJobDescription("");
    setResult(null);
  }, []);

  const scoreGrade = useMemo(() => {
    if (!result) return null;
    if (result.score >= 80) return { label: "Exceptionnel", color: "from-green-600 to-green-400"};
    if (result.score >= 60) return { label: "Excellent", color: "from-emerald-600 to-emerald-400" };
    if (result.score >= 40) return { label: "Satisfaisant", color: "from-lime-600 to-lime-400"};
    return { label: "À parfaire", color: "from-gray-600 to-gray-400"};
  }, [result?.score]);

  const canAnalyze = useMemo(() => 
    Boolean(file && jobDescription.trim() && !loading),
    [file, jobDescription, loading]
  );

  return (
    <div className="h-screen bg-gradient-to-br from-background to-card text-foreground relative lg:overflow-hidden overflow-auto flex flex-col transition-colors duration-300 dark">
      
      <div className="lg:hidden fixed bottom-4 rounded-full right-4 z-50">
        <Button
          size="sm"
          onClick={() => {
            const header = document.getElementById('header-section');
            if (header) {
              header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="shadow-lg rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
        >
          <ArrowUp size={16} />
        </Button>
      </div>
      
      {/* Enhanced background effects - Dark mode optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Single animated gradient orb */}
        <motion.div 
          className="absolute top-0 left-1/2 w-80 h-80 bg-primary/4 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Subtle mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/3 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary/2 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/1 to-transparent" />
        </div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, -300],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Container fixe */}
      <div className="relative z-10 flex flex-col h-full p-4 md:p-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full gap-4">
          
          {/* Header compact */}
          <motion.header 
            id="header-section"
            className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-primary rounded blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-2.5 rounded-2xl shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                  <BrainCircuit className="text-primary" size={28} strokeWidth={2.5} />
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                    ÉPURE
                  </span>
                </h1>  {' '}
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Analyse ton CV pour recevoir des recommandations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">
                © 2025 ÉPURE - Analyse de CV par Antonio Andriatsiaforitrarivo
              </p>
            </div>
          </motion.header>

          {/* Main content - Full screen sections on mobile */}
          <div className="flex-1 lg:grid lg:grid-cols-12 lg:gap-4 lg:min-h-0">
            {/* Configuration Section - Full Screen on Mobile, Half on Desktop */}
            <motion.div 
              className="min-h-screen lg:min-h-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
    
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Job Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Zap size={14} className="text-foreground" /> 
                        Offre d'emploi
                      </span>
                      <motion.span 
                        className="text-xs text-muted-foreground font-normal"
                        key={jobDescription.length}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {jobDescription.length} caractères
                      </motion.span>
                    </label>
                    <Textarea 
                      placeholder="Colle la description du poste ici..." 
                      className="min-h-[120px] resize-none"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  {/* Upload zone */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center justify-between">
                      Curriculum Vitae
                      <AnimatePresence>
                        {file && (
                          <motion.button
                            onClick={() => setFile(null)}
                            className="text-xs text-destructive hover:text-destructive/80 transition-colors font-normal flex items-center gap-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={12} /> Retirer
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </label>
                    <motion.div 
                      className={cn(
                        "relative border-2 border-dashed rounded p-6 text-center transition-all cursor-pointer group overflow-hidden",
                        isDragActive 
                          ? "border-primary bg-primary/10" 
                          : file
                            ? "border-secondary/50 bg-secondary/5"
                            : "border-border hover:border-primary hover:bg-muted"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div {...getRootProps()} className="relative z-10 h-full">
                        <input {...getInputProps()} />
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                          isDragActive && "opacity-20"
                        )} />
                        <div className="relative z-10">
                          <AnimatePresence mode="wait">
                          {file ? (
                            <motion.div
                              key="file-uploaded"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle2 className="mx-auto mb-3 text-secondary" size={36} />
                              <p className="text-sm font-bold text-secondary mb-1 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB • Prêt
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="file-empty"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                animate={isDragActive ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Upload className={cn(
                                  "mx-auto mb-3 transition-colors",
                                  isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )} size={36} />
                              </motion.div>
                              <p className="text-sm text-muted-foreground">
                                {isDragActive ? "Relâche ici !" : "Glisse ton CV ou clique"}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                  <div className="space-y-2 pt-2">
                    <motion.div whileHover={{ scale: canAnalyze ? 1.02 : 1 }} whileTap={{ scale: canAnalyze ? 0.98 : 1 }}>
                      <Button 
                        variant="secondary"
                        className="w-full h-11 relative overflow-hidden group"
                        onClick={handleAnalyze} 
                        disabled={!canAnalyze}
                      >
                        {canAnalyze && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                        
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              Analyse en cours...
                            </>
                          ) : (
                            <>
                              <BrainCircuit size={18} />
                              Commencer l'analyse
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight size={16} />
                              </motion.div>
                            </>
                          )}
                        </span>
                      </Button>
                    </motion.div>
                    
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Button variant="outline" className="w-full" onClick={handleReset}>
                            Nouvelle analyse
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section - Full Screen on Mobile, Right on Desktop */}
            <div id="results-section" className="min-h-screen lg:min-h-0 flex flex-col overflow-y-auto lg:col-span-7">
              {/* Bouton scroll haut - Mobile only */}
              <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <Button
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="shadow-lg bg-primary/90 hover:bg-primary text-primary-foreground"
                >
                  <ArrowUp size={16} />
                </Button>
              </div>
              
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Loading Score Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className=" pb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <motion.div
                                className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <motion.div
                                className="absolute inset-0 w-8 h-8 rounded-full border-2 border-primary/30 border-t-transparent"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-foreground">Analyse en cours</h2>
                              <p className="text-muted-foreground text-sm">L'IA examine votre CV...</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {/* Animated score circle */}
                          <div className="flex flex-col items-center py-6">
                            <motion.div
                              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <BrainCircuit size={40} className="text-primary" />
                                </motion.div>
                              </div>
                            </motion.div>
                            <motion.div
                              className="mt-4 text-center"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <p className="text-sm text-muted-foreground">Calcul du score de matching...</p>
                            </motion.div>
                          </div>
                          
                          {/* Progress bar skeleton */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progression</span>
                              <motion.span 
                                className="text-muted-foreground"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                Analyse...
                              </motion.span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                initial={{ width: '0%' }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Loading Suggestions Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Lightbulb size={16} className="text-primary" />
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
                              Suggestions en cours d'analyse...
                            </h3>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <motion.div
                                className="flex-shrink-0 w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  delay: i * 0.2 
                                }}
                              >
                                <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                              </motion.div>
                              <div className="flex-1 space-y-2">
                                <motion.div
                                  className="h-4 bg-primary/10 rounded"
                                  animate={{ width: ['60%', '90%', '60%'] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                />
                                <motion.div
                                  className="h-3 bg-muted/30 rounded"
                                  animate={{ width: ['40%', '70%', '40%'] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Loading Skills Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Target size={16} className="text-secondary" />
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
                              Compétences en cours d'identification...
                            </h3>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full"
                              animate={{ 
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.95, 1, 0.95]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                delay: i * 0.1 
                              }}
                            >
                              <div className="w-12 h-3 bg-secondary/20 rounded"></div>
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    key="results"
                    className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    
                    {/* Score Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <motion.div 
                          className="h-2 w-full bg-muted"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div 
                            className={cn("h-full bg-gradient-to-r", scoreGrade?.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          />
                        </motion.div>
                        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold mb-1">Matching Rate</h2>
                            <p className="text-muted-foreground text-sm mb-2">Adéquation avec les critères</p>
                            {scoreGrade && (
                              <Badge>{scoreGrade.label}</Badge>
                            )}
                          </div>
                          <motion.div 
                            className="relative"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          >
                            <div className="relative text-5xl md:text-6xl font-black text-foreground">
                              <div className="absolute inset-0 bg-primary blur-2xl opacity-30 rounded" />
                              <div className="relative">
                                {result.score}%
                              </div>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Missing Skills */}
                    {result.missingSkills.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <Card>
                          <CardHeader>
                            <h3 className="text-sm uppercase tracking-widest text-foreground font-bold flex items-center gap-2 px-1">
                              <Target size={16} className="text-secondary" /> 
                              Compétences à développer
                            </h3>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2">
                            {result.missingSkills.map((skill, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge variant="outline">
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm uppercase tracking-widest text-foreground font-bold flex items-center gap-2 px-1">
                          <Lightbulb size={16} className="text-primary" /> 
                          Suggestions d'amélioration
                        </h3>
                        {result.suggestions.map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            whileHover={{ x: 4 }}
                          >
                            <Card>
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                  <motion.div 
                                    className="flex-shrink-0 w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm"
                                    initial={{ rotate: -180 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1, type: "spring" }}
                                  >
                                    {i + 1}
                                  </motion.div>
                                  <div className="flex-1 space-y-2">
                                    <div className="bg-primary/20 border border-primary/10 rounded p-2.5">
                                      <p className="text-sm font-medium leading-relaxed text-primary-foreground">
                                        {s.suggestion}
                                      </p>
                                    </div>
                                    
                                    <div className="space-y-1.5 pl-3 border-l-2 border-border">
                                      <div className="flex items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mt-0.5 whitespace-nowrap">
                                          Actuellement :
                                        </span>
                                        <span className="text-xs text-muted-foreground line-through">
                                          {s.original}
                                        </span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase text-primary mt-0.5 whitespace-nowrap">
                                          Impact :
                                        </span>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {s.reason}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="flex-1 flex flex-col items-center justify-center text-center p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="relative mb-6"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-border"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <div className="relative bg-card p-6 rounded-full border border-border">
                        <FileText size={40} className="text-muted-foreground" strokeWidth={1.5} />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Aucune analyse active
                    </h3>
                    <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                      Importe ton CV et la description du poste pour obtenir une analyse IA détaillée
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    {/* Footer avec copyright */}
      <motion.footer 
        className="flex-shrink-0 border-t py-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-xs text-muted-foreground">
          © 2025 ÉPURE - Analyse de CV par Antonio Andriatsiaforitrarivo. Tous droits réservés.
        </p>
      </motion.footer>
      
      {/* Alert Modal */}
      <Dialog open={alertModal.isOpen} onOpenChange={(open) => setAlertModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              alertModal.type === 'error' ? 'text-destructive' : 
              alertModal.type === 'success' ? 'text-primary' : 
              'text-foreground'
            }`}>
              {alertModal.type === 'error' && <AlertCircle size={20} />}
              {alertModal.type === 'success' && <CheckCircle2 size={20} />}
              {alertModal.type === 'info' && <BrainCircuit size={20} />}
              {alertModal.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {alertModal.message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}