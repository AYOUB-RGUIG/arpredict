import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { predict, type PredictionInput } from "@/lib/prediction";

const PredictionForm = () => {
  const navigate = useNavigate();
  const [attendanceRate, setAttendanceRate] = useState(75);
  const [generalAverage, setGeneralAverage] = useState(12);
  const [homeworkRate, setHomeworkRate] = useState(70);
  const [classParticipation, setClassParticipation] = useState(60);
  const [failedSubjects, setFailedSubjects] = useState(1);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(15);
  const [distanceToSchool, setDistanceToSchool] = useState(5);
  const [parentEducation, setParentEducation] = useState<PredictionInput["parentEducation"]>("secondaire");
  const [familySituation, setFamilySituation] = useState<PredictionInput["familySituation"]>("mariés");
  const [parentIllness, setParentIllness] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: PredictionInput = {
      attendanceRate, generalAverage, homeworkRate, classParticipation,
      failedSubjects, weeklyStudyHours, distanceToSchool, parentEducation,
      familySituation, parentIllness,
    };
    const result = predict(input);
    navigate("/dashboard", { state: { input, result } });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Formulaire de Prédiction</h1>
          <p className="text-muted-foreground">Renseignez les indicateurs académiques pour obtenir une analyse prédictive.</p>
        </div>

        <Card className="animate-fade-in-up animate-delay-200 shadow-lg border-border">
          <CardHeader>
            <CardTitle>Indicateurs de l'étudiant</CardTitle>
            <CardDescription>Tous les champs sont requis pour une prédiction optimale.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attendance Rate */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Taux de présence</Label>
                    <span className="text-sm font-semibold text-secondary">{attendanceRate}%</span>
                  </div>
                  <Slider value={[attendanceRate]} onValueChange={(v) => setAttendanceRate(v[0])} min={0} max={100} step={1} className="py-2" />
                  <p className="text-xs text-muted-foreground">Pourcentage de présence aux cours</p>
                </div>

                {/* General Average */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Moyenne générale</Label>
                    <span className="text-sm font-semibold text-secondary">{generalAverage}/20</span>
                  </div>
                  <Input
                    type="number"
                    value={generalAverage}
                    onChange={(e) => setGeneralAverage(Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                    min={0}
                    max={20}
                    step={0.5}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Note moyenne sur 20</p>
                </div>

                {/* Homework Rate */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Réalisation des devoirs</Label>
                    <span className="text-sm font-semibold text-secondary">{homeworkRate}%</span>
                  </div>
                  <Slider value={[homeworkRate]} onValueChange={(v) => setHomeworkRate(v[0])} min={0} max={100} step={1} className="py-2" />
                  <p className="text-xs text-muted-foreground">Taux de complétion des devoirs</p>
                </div>

                {/* Class Participation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Participation en classe</Label>
                    <span className="text-sm font-semibold text-secondary">{classParticipation}%</span>
                  </div>
                  <Slider value={[classParticipation]} onValueChange={(v) => setClassParticipation(v[0])} min={0} max={100} step={1} className="py-2" />
                  <p className="text-xs text-muted-foreground">Niveau d'engagement en classe</p>
                </div>

                {/* Failed Subjects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Matières échouées</Label>
                    <span className="text-sm font-semibold text-secondary">{failedSubjects}</span>
                  </div>
                  <Input
                    type="number"
                    value={failedSubjects}
                    onChange={(e) => setFailedSubjects(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                    max={15}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Nombre de matières non validées</p>
                </div>

                {/* Weekly Study Hours */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Heures d'étude / semaine</Label>
                    <span className="text-sm font-semibold text-secondary">{weeklyStudyHours}h</span>
                  </div>
                  <Input
                    type="number"
                    value={weeklyStudyHours}
                    onChange={(e) => setWeeklyStudyHours(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                    max={60}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Temps d'étude personnel par semaine</p>
                </div>

                {/* Distance */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Distance domicile-école (km)</Label>
                  <Input
                    type="number"
                    value={distanceToSchool}
                    onChange={(e) => setDistanceToSchool(Math.max(0, parseFloat(e.target.value) || 0))}
                    min={0}
                    max={200}
                    step={0.5}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Distance entre le domicile et l'établissement</p>
                </div>

                {/* Parent Education */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Niveau d'études des parents</Label>
                  <Select value={parentEducation} onValueChange={(v) => setParentEducation(v as PredictionInput["parentEducation"])}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucun">Aucun</SelectItem>
                      <SelectItem value="primaire">Primaire</SelectItem>
                      <SelectItem value="secondaire">Secondaire</SelectItem>
                      <SelectItem value="supérieur">Supérieur</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Plus haut niveau d'éducation atteint</p>
                </div>

                {/* Family Situation */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Situation familiale</Label>
                  <Select value={familySituation} onValueChange={(v) => setFamilySituation(v as PredictionInput["familySituation"])}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mariés">Parents mariés</SelectItem>
                      <SelectItem value="divorcés">Parents divorcés</SelectItem>
                      <SelectItem value="décès_un">Décès d'un parent</SelectItem>
                      <SelectItem value="décès_deux">Décès des deux parents</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Situation actuelle des parents</p>
                </div>

                {/* Parent Illness */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Maladie grave d'un parent</Label>
                  <div className="flex items-center gap-3 h-11">
                    <Switch checked={parentIllness} onCheckedChange={setParentIllness} />
                    <span className="text-sm text-muted-foreground">{parentIllness ? "Oui" : "Non"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Un parent souffre-t-il d'une maladie grave cette année ?</p>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="gradient" size="xl" className="w-full gap-2">
                  <Brain className="h-5 w-5" /> Lancer la prédiction intelligente <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionForm;
