import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, AlertCircle, CheckCircle2, TrendingUp, TrendingDown,
  Clock, BookOpen, GraduationCap, Users, Brain, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskGauge from "@/components/RiskGauge";
import DashboardCharts from "@/components/DashboardCharts";
import type { PredictionInput, PredictionResult } from "@/lib/prediction";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { input: PredictionInput; result: PredictionResult } | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Aucune prédiction disponible</h2>
            <p className="text-muted-foreground mb-6">Veuillez d'abord remplir le formulaire de prédiction pour obtenir des résultats.</p>
            <Button variant="gradient" onClick={() => navigate("/prediction")} className="gap-2">
              <Brain className="h-4 w-4" /> Aller au formulaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { input, result } = state;

  const statsCards = [
    { icon: Users, label: "Présence", value: `${input.attendanceRate}%`, color: "text-secondary" },
    { icon: GraduationCap, label: "Moyenne", value: `${input.generalAverage}/20`, color: "text-primary" },
    { icon: BookOpen, label: "Devoirs", value: `${input.homeworkRate}%`, color: "text-secondary" },
    { icon: Clock, label: "Étude", value: `${input.weeklyStudyHours}h/sem`, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <Button variant="ghost" size="sm" onClick={() => navigate("/prediction")} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Nouvelle prédiction
          </Button>
        </div>

        {/* Risk Score Section */}
        <div className="text-center mb-12 animate-fade-in-up animate-delay-100">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Résultats de la Prédiction</h1>
          <RiskGauge score={result.riskScore} level={result.riskLevel} />

          {/* Diagnosis */}
          <Card className="max-w-2xl mx-auto mt-8 border-secondary/20 bg-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Diagnostic</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.diagnosis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statsCards.map((stat, i) => (
            <Card key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-6">Visualisations Analytiques</h2>
          <DashboardCharts featureImportance={result.featureImportance} />
        </div>

        {/* Recommendations */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Recommandations Pédagogiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explainability Section */}
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Pourquoi ce résultat ? (XAI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Facteurs clés identifiés par notre modèle d'IA explicable :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.factors.map((factor, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    factor.impact === "positive"
                      ? "border-risk-low/30 bg-risk-low/5"
                      : "border-risk-high/30 bg-risk-high/5"
                  }`}
                >
                  {factor.impact === "positive" ? (
                    <TrendingUp className="h-5 w-5 text-risk-low shrink-0" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-risk-high shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{factor.name}</p>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
