import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  level: "Faible" | "Moyen" | "Élevé";
}

const RiskGauge = ({ score, level }: RiskGaugeProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = animated ? circumference - (score / 100) * circumference : circumference;

  const getColor = () => {
    if (score <= 33) return { stroke: "#2BA87A", bg: "bg-risk-low/10", text: "text-risk-low", label: "Risque Faible" };
    if (score <= 66) return { stroke: "#E9A020", bg: "bg-risk-medium/10", text: "text-risk-medium", label: "Risque Moyen" };
    return { stroke: "#D93636", bg: "bg-risk-high/10", text: "text-risk-high", label: "Risque Élevé" };
  };

  const colorInfo = getColor();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg viewBox="0 0 200 130" className="w-64 h-auto">
          {/* Background arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke={colorInfo.stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
          {/* Score text */}
          <text x="100" y="95" textAnchor="middle" className="text-4xl font-extrabold" fill="currentColor">
            {animated ? score : 0}%
          </text>
          <text x="100" y="118" textAnchor="middle" className="text-xs font-medium" fill="hsl(var(--muted-foreground))">
            Score de risque
          </text>
        </svg>
      </div>

      {/* Risk badge */}
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${colorInfo.bg} ${colorInfo.text} font-semibold text-sm`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: colorInfo.stroke }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: colorInfo.stroke }} />
        </span>
        {colorInfo.label}
      </div>
    </div>
  );
};

export default RiskGauge;
