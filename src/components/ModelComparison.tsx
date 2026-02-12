import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ModelMetrics } from "@/lib/ml-pipeline";

interface ModelComparisonProps {
  models: ModelMetrics[];
}

const ModelComparison = ({ models }: ModelComparisonProps) => {
  const barData = models.map((m) => ({
    name: m.shortName,
    Accuracy: parseFloat((m.accuracy * 100).toFixed(1)),
    Précision: parseFloat((m.precision * 100).toFixed(1)),
    Rappel: parseFloat((m.recall * 100).toFixed(1)),
    "F1-Score": parseFloat((m.f1Score * 100).toFixed(1)),
  }));

  const radarData = [
    { metric: "Accuracy", ...Object.fromEntries(models.map((m) => [m.shortName, m.accuracy * 100])) },
    { metric: "Précision", ...Object.fromEntries(models.map((m) => [m.shortName, m.precision * 100])) },
    { metric: "Rappel", ...Object.fromEntries(models.map((m) => [m.shortName, m.recall * 100])) },
    { metric: "F1-Score", ...Object.fromEntries(models.map((m) => [m.shortName, m.f1Score * 100])) },
  ];

  const COLORS = ["#0F2D52", "#25A89B", "#E9A020"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparaison des métriques par modèle</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[50, 100]} unit="%" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val: number) => `${val}%`} />
              <Legend />
              <Bar dataKey="Accuracy" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Précision" fill={COLORS[1]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Rappel" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="F1-Score" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil de performance (Radar)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[50, 100]} tick={{ fontSize: 10 }} />
              {models.map((m, i) => (
                <Radar
                  key={m.shortName}
                  name={m.shortName}
                  dataKey={m.shortName}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Model Cards */}
      {models.map((model) => (
        <Card key={model.shortName} className={model.isBestModel ? "border-secondary ring-1 ring-secondary/30" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{model.name}</CardTitle>
              {model.isBestModel && (
                <Badge className="bg-secondary text-secondary-foreground">
                  ★ Meilleur Modèle
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-lg font-bold text-foreground">{(model.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">F1-Score</p>
                <p className="text-lg font-bold text-secondary">{(model.f1Score * 100).toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Précision</p>
                <p className="text-lg font-bold text-foreground">{(model.precision * 100).toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Rappel</p>
                <p className="text-lg font-bold text-foreground">{(model.recall * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground font-medium">Méthode Ensembliste :</span>
                <span className="ml-1 text-foreground">{model.ensembleMethod}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Régularisation :</span>
                <span className="ml-1 text-foreground">{model.regularization}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Temps d'entraînement :</span>
                <span className="ml-1 text-foreground">{model.trainingTime}ms</span>
              </div>
            </div>

            {/* Hyperparameters */}
            <details className="mt-3">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Hyperparamètres (GridSearchCV)
              </summary>
              <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono space-y-1">
                {Object.entries(model.hyperparameters).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-muted-foreground">{k}:</span>{" "}
                    <span className="text-secondary">{String(v)}</span>
                  </div>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelComparison;
