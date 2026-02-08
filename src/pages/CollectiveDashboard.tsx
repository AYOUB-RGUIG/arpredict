import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, AlertCircle, Brain, Users, TrendingUp, TrendingDown,
  CheckCircle2, ChevronDown, ChevronUp, BarChart3,
} from "lucide-react";
import { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ScatterChart, Scatter, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import RiskGauge from "@/components/RiskGauge";
import type { StudentResult } from "@/lib/prediction";

const RISK_COLORS = {
  Faible: "#2BA87A",
  Moyen: "#E9A020",
  Élevé: "#D93636",
};

const CollectiveDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { results: StudentResult[] } | null;
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  if (!state || !state.results?.length) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Aucune prédiction collective</h2>
            <p className="text-muted-foreground mb-6">Veuillez d'abord remplir le formulaire collectif.</p>
            <Button variant="gradient" onClick={() => navigate("/collective")} className="gap-2">
              <Users className="h-4 w-4" /> Aller au formulaire collectif
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { results } = state;

  // Aggregate stats
  const avgRisk = Math.round(results.reduce((s, r) => s + r.result.riskScore, 0) / results.length);
  const riskCounts = { Faible: 0, Moyen: 0, Élevé: 0 };
  results.forEach((r) => riskCounts[r.result.riskLevel]++);
  const pieData = Object.entries(riskCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, fill: RISK_COLORS[name as keyof typeof RISK_COLORS] }));

  // Scatter data: average vs risk
  const scatterData = results.map((r) => ({
    name: r.input.studentName || "Étudiant",
    average: r.input.generalAverage,
    risk: r.result.riskScore,
  }));

  // Bar chart: each student's risk score
  const barData = results.map((r, i) => ({
    name: r.input.studentName || `Ét. ${i + 1}`,
    score: r.result.riskScore,
    fill: RISK_COLORS[r.result.riskLevel],
  }));

  const selected = selectedStudent !== null ? results[selectedStudent] : null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <Button variant="ghost" size="sm" onClick={() => navigate("/collective")} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Nouvelle analyse
          </Button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in-up">
          Dashboard Collectif
        </h1>
        <p className="text-muted-foreground mb-8 animate-fade-in-up animate-delay-100">
          Résultats pour {results.length} étudiant{results.length > 1 ? "s" : ""}
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="animate-fade-in-up animate-delay-100">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Étudiants</p>
              <p className="text-2xl font-bold text-foreground">{results.length}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up animate-delay-200">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Risque moyen</p>
              <p className="text-2xl font-bold text-foreground">{avgRisk}%</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up animate-delay-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Risque élevé</p>
              <p className="text-2xl font-bold" style={{ color: RISK_COLORS.Élevé }}>{riskCounts.Élevé}</p>
            </CardContent>
          </Card>
          <Card className="animate-fade-in-up animate-delay-400">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Risque faible</p>
              <p className="text-2xl font-bold" style={{ color: RISK_COLORS.Faible }}>{riskCounts.Faible}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-base">Répartition des niveaux de risque</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    paddingAngle={4} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart - Scores per student */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-base">Score de risque par étudiant</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis unit="%" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" name="Risque" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scatter Plot */}
          <Card className="animate-fade-in-up md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Corrélation Moyenne Générale vs Score de Risque</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="average" name="Moyenne" unit="/20" tick={{ fontSize: 12 }} />
                  <YAxis type="number" dataKey="risk" name="Risque" unit="%" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Étudiants" data={scatterData} fill="#25A89B" fillOpacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" /> Résultats Détaillés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Présence</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead className="text-right">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow
                    key={i}
                    className={`cursor-pointer ${selectedStudent === i ? "bg-secondary/5" : ""}`}
                    onClick={() => setSelectedStudent(selectedStudent === i ? null : i)}
                  >
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{r.input.studentName || `Étudiant ${i + 1}`}</TableCell>
                    <TableCell>{r.input.generalAverage}/20</TableCell>
                    <TableCell>{r.input.attendanceRate}%</TableCell>
                    <TableCell className="font-bold">{r.result.riskScore}%</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold"
                        style={{
                          color: RISK_COLORS[r.result.riskLevel],
                          borderColor: RISK_COLORS[r.result.riskLevel],
                          backgroundColor: `${RISK_COLORS[r.result.riskLevel]}10`,
                        }}
                      >
                        {r.result.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {selectedStudent === i ? (
                        <ChevronUp className="h-4 w-4 inline text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 inline text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Selected Student Detail */}
        {selected && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              Détail — {selected.input.studentName || `Étudiant ${selectedStudent! + 1}`}
            </h2>

            {/* Risk Gauge */}
            <div className="flex justify-center">
              <RiskGauge score={selected.result.riskScore} level={selected.result.riskLevel} />
            </div>

            {/* Diagnosis */}
            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Diagnostic</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.result.diagnosis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5 text-secondary" /> Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selected.result.recommendations.map((rec, i) => (
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

            {/* Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5 text-accent" /> Facteurs Explicatifs (XAI)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.result.factors.map((factor, i) => (
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
        )}
      </div>
    </div>
  );
};

export default CollectiveDashboard;
