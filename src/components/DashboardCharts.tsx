import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FeatureImportance, generateSimulatedData } from "@/lib/prediction";

const CHART_COLORS = {
  primary: "#0F2D52",
  secondary: "#25A89B",
  accent: "#E9A020",
  riskLow: "#2BA87A",
  riskMedium: "#E9A020",
  riskHigh: "#D93636",
};

interface DashboardChartsProps {
  featureImportance: FeatureImportance[];
}

const DashboardCharts = ({ featureImportance }: DashboardChartsProps) => {
  const { riskDistribution, correlationData, evolutionData } = generateSimulatedData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risk Distribution Pie Chart */}
      <Card className="animate-fade-in-up animate-delay-100">
        <CardHeader>
          <CardTitle className="text-base">Répartition des niveaux de risque</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Importance Bar Chart */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader>
          <CardTitle className="text-base">Importance des variables</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="importance" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Correlation Scatter Plot */}
      <Card className="animate-fade-in-up animate-delay-300">
        <CardHeader>
          <CardTitle className="text-base">Corrélation Moyenne vs Risque</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="average" name="Moyenne" unit="/20" tick={{ fontSize: 12 }} />
              <YAxis type="number" dataKey="risk" name="Risque" unit="%" tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={correlationData} fill={CHART_COLORS.primary} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Evolution Line Chart */}
      <Card className="animate-fade-in-up animate-delay-400">
        <CardHeader>
          <CardTitle className="text-base">Évolution du risque dans le temps</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis unit="%" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="risk"
                name="Score de risque"
                stroke={CHART_COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.secondary, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
