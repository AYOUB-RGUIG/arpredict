import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfusionMatrixProps {
  matrix: number[][];
  labels: string[];
  title: string;
}

const ConfusionMatrix = ({ matrix, labels, title }: ConfusionMatrixProps) => {
  const maxVal = Math.max(...matrix.flat());

  const getIntensity = (val: number) => {
    const ratio = val / (maxVal || 1);
    return ratio;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-1 text-muted-foreground font-normal text-right" colSpan={1} rowSpan={1} />
                <th className="p-1 text-center text-muted-foreground font-medium" colSpan={labels.length}>
                  Prédit
                </th>
              </tr>
              <tr>
                <th className="p-1" />
                {labels.map((l) => (
                  <th key={l} className="p-1 text-center font-medium text-foreground">
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="p-1 text-right font-medium text-foreground pr-2">
                    {i === 0 && (
                      <span className="text-muted-foreground text-[10px] block leading-tight">Réel</span>
                    )}
                    {labels[i]}
                  </td>
                  {row.map((val, j) => {
                    const intensity = getIntensity(val);
                    const isDiagonal = i === j;
                    return (
                      <td
                        key={j}
                        className="p-1 text-center font-semibold rounded-sm"
                        style={{
                          backgroundColor: isDiagonal
                            ? `hsl(174 65% 42% / ${0.15 + intensity * 0.55})`
                            : `hsl(0 75% 55% / ${intensity * 0.35})`,
                          color: intensity > 0.5 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                          minWidth: 40,
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfusionMatrix;
