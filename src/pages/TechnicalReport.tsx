import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Database, Cog, Split, GraduationCap, FlaskConical,
  BarChart3, CheckCircle2, AlertTriangle, Play, Trophy, Beaker,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfusionMatrix from "@/components/ConfusionMatrix";
import ModelComparison from "@/components/ModelComparison";
import { runPipeline, testExtrapolation, type PipelineResult, type ExtrapolationResult } from "@/lib/ml-pipeline";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const STEP_ICONS: Record<string, React.ElementType> = {
  load: Database,
  preprocess: Cog,
  split: Split,
  train: GraduationCap,
  predict: Play,
  evaluate: BarChart3,
};

const TechnicalReport = () => {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState<PipelineResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [extraResult, setExtraResult] = useState<ExtrapolationResult | null>(null);

  // Extrapolation form state
  const [extraAttendance, setExtraAttendance] = useState("110");
  const [extraAverage, setExtraAverage] = useState("22");
  const [extraStudyHours, setExtraStudyHours] = useState("70");

  const runSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setPipeline(null);

    const result = runPipeline();

    // Animate steps
    for (let i = 0; i < result.steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
    }

    setPipeline(result);
    setIsRunning(false);
  };

  const handleExtrapolation = () => {
    const result = testExtrapolation({
      attendanceRate: parseFloat(extraAttendance) || 75,
      generalAverage: parseFloat(extraAverage) || 12,
      weeklyStudyHours: parseFloat(extraStudyHours) || 15,
    });
    setExtraResult(result);
  };

  const bestFeatureImportance = useMemo(() => {
    if (!pipeline) return [];
    return pipeline.featureImportanceByModel[pipeline.bestModel.shortName] || [];
  }, [pipeline]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Button>
        </div>

        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Rapport Technique ML
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pipeline complet d'apprentissage automatique : Prétraitement → Entraînement → Évaluation → Sélection du meilleur modèle.
          </p>
        </div>

        {/* Run Button */}
        {!pipeline && (
          <div className="text-center mb-12 animate-fade-in-up animate-delay-200">
            <Button
              variant="gradient"
              size="xl"
              onClick={runSimulation}
              disabled={isRunning}
              className="gap-3"
            >
              {isRunning ? (
                <>
                  <Cog className="h-5 w-5 animate-spin" /> Exécution du pipeline...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" /> Lancer le pipeline ML complet
                </>
              )}
            </Button>

            {/* Animated steps during run */}
            {isRunning && (
              <div className="mt-8 max-w-lg mx-auto space-y-3">
                {runPipeline().steps.map((step, i) => {
                  const Icon = STEP_ICONS[step.id] || Cog;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        i < currentStep
                          ? "bg-secondary/5 border-secondary/30"
                          : i === currentStep
                            ? "bg-accent/5 border-accent/30 animate-pulse-soft"
                            : "bg-muted/30 border-border opacity-40"
                      }`}
                    >
                      {i < currentStep ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                      ) : i === currentStep ? (
                        <Cog className="h-5 w-5 text-accent animate-spin shrink-0" />
                      ) : (
                        <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{step.nameFr}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {pipeline && (
          <Tabs defaultValue="pipeline" className="animate-fade-in-up">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="models">Modèles</TabsTrigger>
              <TabsTrigger value="evaluation">Évaluation</TabsTrigger>
              <TabsTrigger value="extrapolation">Extrapolation</TabsTrigger>
            </TabsList>

            {/* Pipeline Tab */}
            <TabsContent value="pipeline" className="space-y-6">
              {/* Dataset Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="h-5 w-5 text-secondary" />
                    Informations sur le jeu de données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Échantillons</p>
                      <p className="text-xl font-bold text-foreground">{pipeline.datasetInfo.totalSamples}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Train / Test</p>
                      <p className="text-xl font-bold text-foreground">{pipeline.datasetInfo.splitRatio}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Variables</p>
                      <p className="text-xl font-bold text-foreground">{pipeline.datasetInfo.features}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Valeurs manquantes</p>
                      <p className="text-xl font-bold text-foreground">{pipeline.datasetInfo.missingValues}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Classes :</span>
                    {pipeline.datasetInfo.classes.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                    <span className="text-xs text-muted-foreground ml-4">Encodées :</span>
                    {pipeline.datasetInfo.encodedFeatures.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs font-mono">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Étapes du Pipeline ML</CardTitle>
                  <CardDescription>
                    Workflow : Chargement → Prétraitement → Séparation → Entraînement → Prédiction → Évaluation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pipeline.steps.map((step) => {
                    const Icon = STEP_ICONS[step.id] || Cog;
                    return (
                      <details key={step.id} className="group">
                        <summary className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                          <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 text-left">
                            <span className="text-sm font-medium text-foreground">{step.nameFr}</span>
                            <span className="text-xs text-muted-foreground ml-2">({step.duration}ms)</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Terminé</Badge>
                        </summary>
                        <div className="mt-2 ml-12 space-y-1 pb-2">
                          {step.details.map((d, i) => (
                            <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-secondary mt-0.5">•</span> {d}
                            </p>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Models Tab */}
            <TabsContent value="models">
              <ModelComparison models={pipeline.models} />
            </TabsContent>

            {/* Evaluation Tab */}
            <TabsContent value="evaluation" className="space-y-6">
              {/* Best Model Banner */}
              <Card className="border-secondary bg-secondary/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <Trophy className="h-8 w-8 text-secondary shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      Meilleur modèle : {pipeline.bestModel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sélectionné automatiquement par F1-Score pondéré ({(pipeline.bestModel.f1Score * 100).toFixed(1)}%)
                      — Ce modèle est utilisé par défaut pour l'outil de prédiction.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Confusion Matrices */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Matrices de Confusion</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pipeline.models.map((m) => (
                    <ConfusionMatrix
                      key={m.shortName}
                      matrix={m.confusionMatrix}
                      labels={["Faible", "Moyen", "Élevé"]}
                      title={`${m.name}${m.isBestModel ? " ★" : ""}`}
                    />
                  ))}
                </div>
              </div>

              {/* Feature Importance for best model */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Importance des variables — {pipeline.bestModel.name} (SHAP / XAI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bestFeatureImportance} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip formatter={(val: number) => (val * 100).toFixed(1) + "%"} />
                      <Bar dataKey="importance" fill="#25A89B" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Re-run */}
              <div className="text-center">
                <Button variant="outline" onClick={runSimulation} className="gap-2">
                  <Play className="h-4 w-4" /> Relancer le pipeline
                </Button>
              </div>
            </TabsContent>

            {/* Extrapolation Tab */}
            <TabsContent value="extrapolation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Beaker className="h-5 w-5 text-accent" />
                    Test d'extrapolation (Données hors-plage)
                  </CardTitle>
                  <CardDescription>
                    Testez la robustesse des modèles avec des valeurs extrêmes ou inhabituelles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label className="text-sm">Taux de présence (%)</Label>
                      <Input
                        value={extraAttendance}
                        onChange={(e) => setExtraAttendance(e.target.value)}
                        placeholder="Ex: 110 (hors-plage)"
                      />
                      <p className="text-xs text-muted-foreground">Plage normale : 0-100</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Moyenne générale (/20)</Label>
                      <Input
                        value={extraAverage}
                        onChange={(e) => setExtraAverage(e.target.value)}
                        placeholder="Ex: 22 (hors-plage)"
                      />
                      <p className="text-xs text-muted-foreground">Plage normale : 0-20</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Heures d'étude / semaine</Label>
                      <Input
                        value={extraStudyHours}
                        onChange={(e) => setExtraStudyHours(e.target.value)}
                        placeholder="Ex: 70 (hors-plage)"
                      />
                      <p className="text-xs text-muted-foreground">Plage normale : 0-60</p>
                    </div>
                  </div>
                  <Button onClick={handleExtrapolation} variant="gradient" className="gap-2">
                    <Beaker className="h-4 w-4" /> Tester l'extrapolation
                  </Button>

                  {extraResult && (
                    <div className="mt-6 space-y-4">
                      <div
                        className={`p-4 rounded-lg border ${
                          extraResult.warning.startsWith("⚠")
                            ? "bg-accent/5 border-accent/30"
                            : "bg-secondary/5 border-secondary/30"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {extraResult.warning.startsWith("⚠") ? (
                            <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm text-foreground">{extraResult.warning}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {extraResult.predictions.map((p) => (
                          <Card key={p.model}>
                            <CardContent className="p-4 text-center">
                              <p className="text-sm font-medium text-foreground mb-2">{p.model}</p>
                              <Badge
                                className={
                                  p.riskLevel === "Faible"
                                    ? "bg-risk-low text-white"
                                    : p.riskLevel === "Moyen"
                                      ? "bg-risk-medium text-white"
                                      : "bg-risk-high text-white"
                                }
                              >
                                {p.riskLevel}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-2">
                                Confiance : {(p.confidence * 100).toFixed(1)}%
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default TechnicalReport;
