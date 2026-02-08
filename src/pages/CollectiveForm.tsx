import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain, ArrowRight, Plus, Trash2, Upload, Users, Download, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { predict, getDefaultInput, parseCSV, type PredictionInput, type StudentResult } from "@/lib/prediction";
import { useToast } from "@/hooks/use-toast";

const PARENT_EDUCATION_LABELS: Record<PredictionInput["parentEducation"], string> = {
  aucun: "Aucun",
  primaire: "Primaire",
  secondaire: "Secondaire",
  supérieur: "Supérieur",
};

const FAMILY_LABELS: Record<PredictionInput["familySituation"], string> = {
  mariés: "Parents mariés",
  divorcés: "Parents divorcés",
  décès_un: "Décès d'un parent",
  décès_deux: "Décès des deux parents",
};

const CollectiveForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<PredictionInput[]>([getDefaultInput()]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const addStudent = () => {
    const newStudent = getDefaultInput();
    newStudent.studentName = `Étudiant ${students.length + 1}`;
    setStudents([...students, newStudent]);
    setExpandedIndex(students.length);
  };

  const removeStudent = (index: number) => {
    if (students.length <= 1) return;
    setStudents(students.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const updateStudent = (index: number, field: keyof PredictionInput, value: any) => {
    setStudents(students.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast({ title: "Erreur", description: "Aucun étudiant trouvé dans le fichier CSV.", variant: "destructive" });
        return;
      }
      setStudents(parsed);
      setExpandedIndex(0);
      toast({ title: "Import réussi", description: `${parsed.length} étudiant(s) importé(s) depuis le fichier CSV.` });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const header = "nom;présence;moyenne;devoirs;participation;échouées;heures_étude;distance;éducation_parents;situation_familiale;maladie_parent";
    const example = "Ahmed Ben Ali;85;14;80;70;0;20;3;secondaire;mariés;non";
    const blob = new Blob([header + "\n" + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_etudiants.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results: StudentResult[] = students.map((input) => ({
      input,
      result: predict(input),
    }));
    navigate("/collective-dashboard", { state: { results } });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Prédiction Collective
          </h1>
          <p className="text-muted-foreground">
            Ajoutez plusieurs étudiants ou importez un fichier CSV pour une analyse groupée.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up animate-delay-100">
          <Button type="button" variant="outline" onClick={addStudent} className="gap-2">
            <Plus className="h-4 w-4" /> Ajouter un étudiant
          </Button>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Importer CSV
          </Button>
          <Button type="button" variant="ghost" onClick={downloadTemplate} className="gap-2 text-muted-foreground">
            <Download className="h-4 w-4" /> Modèle CSV
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {students.length} étudiant{students.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Student Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {students.map((student, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <Card
                key={index}
                className="animate-fade-in-up border-border overflow-hidden"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                {/* Collapsed Header */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">
                      {student.studentName || `Étudiant ${index + 1}`}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Moy: {student.generalAverage}/20 · Présence: {student.attendanceRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {students.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); removeStudent(index); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <CardContent className="px-4 pb-6 pt-2 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nom */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm font-medium">Nom de l'étudiant</Label>
                        <Input
                          value={student.studentName || ""}
                          onChange={(e) => updateStudent(index, "studentName", e.target.value)}
                          placeholder="Nom complet"
                          className="h-11"
                        />
                      </div>

                      {/* Attendance */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Taux de présence</Label>
                          <span className="text-sm font-semibold text-secondary">{student.attendanceRate}%</span>
                        </div>
                        <Slider value={[student.attendanceRate]} onValueChange={(v) => updateStudent(index, "attendanceRate", v[0])} min={0} max={100} step={1} />
                      </div>

                      {/* Average */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Moyenne générale</Label>
                          <span className="text-sm font-semibold text-secondary">{student.generalAverage}/20</span>
                        </div>
                        <Input
                          type="number" value={student.generalAverage}
                          onChange={(e) => updateStudent(index, "generalAverage", Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)))}
                          min={0} max={20} step={0.5} className="h-11"
                        />
                      </div>

                      {/* Homework */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Réalisation des devoirs</Label>
                          <span className="text-sm font-semibold text-secondary">{student.homeworkRate}%</span>
                        </div>
                        <Slider value={[student.homeworkRate]} onValueChange={(v) => updateStudent(index, "homeworkRate", v[0])} min={0} max={100} step={1} />
                      </div>

                      {/* Participation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Participation en classe</Label>
                          <span className="text-sm font-semibold text-secondary">{student.classParticipation}%</span>
                        </div>
                        <Slider value={[student.classParticipation]} onValueChange={(v) => updateStudent(index, "classParticipation", v[0])} min={0} max={100} step={1} />
                      </div>

                      {/* Failed */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Matières échouées</Label>
                        <Input
                          type="number" value={student.failedSubjects}
                          onChange={(e) => updateStudent(index, "failedSubjects", Math.max(0, parseInt(e.target.value) || 0))}
                          min={0} max={15} className="h-11"
                        />
                      </div>

                      {/* Study Hours */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Heures d'étude / semaine</Label>
                        <Input
                          type="number" value={student.weeklyStudyHours}
                          onChange={(e) => updateStudent(index, "weeklyStudyHours", Math.max(0, parseInt(e.target.value) || 0))}
                          min={0} max={60} className="h-11"
                        />
                      </div>

                      {/* Distance */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Distance domicile-école (km)</Label>
                        <Input
                          type="number" value={student.distanceToSchool}
                          onChange={(e) => updateStudent(index, "distanceToSchool", Math.max(0, parseFloat(e.target.value) || 0))}
                          min={0} max={200} step={0.5} className="h-11"
                        />
                      </div>

                      {/* Parent Education */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Niveau d'études des parents</Label>
                        <Select
                          value={student.parentEducation}
                          onValueChange={(v) => updateStudent(index, "parentEducation", v)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PARENT_EDUCATION_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Family Situation */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Situation familiale</Label>
                        <Select
                          value={student.familySituation}
                          onValueChange={(v) => updateStudent(index, "familySituation", v)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(FAMILY_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Parent Illness */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Maladie grave d'un parent</Label>
                        <div className="flex items-center gap-3 h-11">
                          <Switch
                            checked={student.parentIllness}
                            onCheckedChange={(v) => updateStudent(index, "parentIllness", v)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {student.parentIllness ? "Oui" : "Non"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" variant="gradient" size="xl" className="w-full gap-2">
              <Brain className="h-5 w-5" />
              Lancer la prédiction pour {students.length} étudiant{students.length > 1 ? "s" : ""}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectiveForm;
