export interface PredictionInput {
  studentName?: string;
  attendanceRate: number;
  generalAverage: number;
  homeworkRate: number;
  classParticipation: number;
  failedSubjects: number;
  weeklyStudyHours: number;
  distanceToSchool: number;
  parentEducation: "aucun" | "primaire" | "secondaire" | "supérieur";
  familySituation: "mariés" | "divorcés" | "décès_un" | "décès_deux";
  parentIllness: boolean;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  value: number;
}

export interface Factor {
  name: string;
  impact: "positive" | "negative";
  description: string;
}

export interface PredictionResult {
  riskScore: number;
  riskLevel: "Faible" | "Moyen" | "Élevé";
  recommendations: string[];
  featureImportance: FeatureImportance[];
  factors: Factor[];
  diagnosis: string;
}

export interface StudentResult {
  input: PredictionInput;
  result: PredictionResult;
}

const PARENT_EDUCATION_RISK: Record<PredictionInput["parentEducation"], number> = {
  aucun: 0.9,
  primaire: 0.6,
  secondaire: 0.3,
  supérieur: 0.1,
};

const FAMILY_SITUATION_RISK: Record<PredictionInput["familySituation"], number> = {
  mariés: 0.1,
  divorcés: 0.4,
  décès_un: 0.7,
  décès_deux: 0.95,
};

export function predict(input: PredictionInput): PredictionResult {
  const attendanceRisk = 1 - input.attendanceRate / 100;
  const averageRisk = 1 - input.generalAverage / 20;
  const homeworkRisk = 1 - input.homeworkRate / 100;
  const participationRisk = 1 - input.classParticipation / 100;
  const failedRisk = Math.min(input.failedSubjects / 5, 1);
  const studyRisk = 1 - Math.min(input.weeklyStudyHours / 30, 1);
  const distanceRisk = Math.min(input.distanceToSchool / 50, 1);
  const parentEduRisk = PARENT_EDUCATION_RISK[input.parentEducation];
  const familyRisk = FAMILY_SITUATION_RISK[input.familySituation];
  const illnessRisk = input.parentIllness ? 0.8 : 0;

  const weights = {
    attendance: 0.15,
    average: 0.20,
    homework: 0.10,
    participation: 0.08,
    failed: 0.15,
    study: 0.07,
    distance: 0.05,
    parentEdu: 0.08,
    family: 0.07,
    illness: 0.05,
  };

  const rawScore =
    weights.attendance * attendanceRisk +
    weights.average * averageRisk +
    weights.homework * homeworkRisk +
    weights.participation * participationRisk +
    weights.failed * failedRisk +
    weights.study * studyRisk +
    weights.distance * distanceRisk +
    weights.parentEdu * parentEduRisk +
    weights.family * familyRisk +
    weights.illness * illnessRisk;

  const noise = (Math.random() - 0.5) * 0.04;
  const riskScore = Math.max(0, Math.min(100, Math.round((rawScore + noise) * 100)));
  const riskLevel: PredictionResult["riskLevel"] =
    riskScore <= 33 ? "Faible" : riskScore <= 66 ? "Moyen" : "Élevé";

  const recommendations: string[] = [];
  if (attendanceRisk > 0.4) recommendations.push("Améliorer le taux de présence aux cours pour renforcer la compréhension des matières.");
  if (averageRisk > 0.5) recommendations.push("Consulter un tuteur pour renforcer les bases dans les matières principales.");
  if (homeworkRisk > 0.4) recommendations.push("Compléter systématiquement les devoirs et exercices assignés.");
  if (participationRisk > 0.5) recommendations.push("Participer activement en classe pour améliorer la compréhension.");
  if (failedRisk > 0.3) recommendations.push("Prioriser le rattrapage des matières échouées avec un plan d'étude ciblé.");
  if (studyRisk > 0.5) recommendations.push("Augmenter progressivement le temps d'étude hebdomadaire.");
  if (distanceRisk > 0.5) recommendations.push("Envisager des solutions de transport ou d'hébergement pour réduire le temps de trajet.");
  if (parentEduRisk > 0.5) recommendations.push("Mettre en place un accompagnement scolaire supplémentaire pour compenser le manque de soutien parental.");
  if (familyRisk > 0.3) recommendations.push("Proposer un suivi psychologique pour accompagner l'étudiant dans sa situation familiale.");
  if (input.parentIllness) recommendations.push("Accorder une attention particulière et un soutien social à l'étudiant affecté par la maladie parentale.");
  if (riskScore > 50) recommendations.push("Envisager un accompagnement pédagogique personnalisé.");
  if (recommendations.length === 0) {
    recommendations.push("Excellent profil ! Continuez sur cette lancée.");
    recommendations.push("Envisagez des activités parascolaires pour enrichir votre parcours.");
  }

  const featureImportance: FeatureImportance[] = [
    { feature: "Moyenne générale", importance: Math.round(weights.average * averageRisk * 100), value: input.generalAverage },
    { feature: "Taux de présence", importance: Math.round(weights.attendance * attendanceRisk * 100), value: input.attendanceRate },
    { feature: "Matières échouées", importance: Math.round(weights.failed * failedRisk * 100), value: input.failedSubjects },
    { feature: "Devoirs réalisés", importance: Math.round(weights.homework * homeworkRisk * 100), value: input.homeworkRate },
    { feature: "Participation", importance: Math.round(weights.participation * participationRisk * 100), value: input.classParticipation },
    { feature: "Heures d'étude", importance: Math.round(weights.study * studyRisk * 100), value: input.weeklyStudyHours },
    { feature: "Distance école", importance: Math.round(weights.distance * distanceRisk * 100), value: input.distanceToSchool },
    { feature: "Éducation parents", importance: Math.round(weights.parentEdu * parentEduRisk * 100), value: parentEduRisk * 100 },
    { feature: "Situation familiale", importance: Math.round(weights.family * familyRisk * 100), value: familyRisk * 100 },
    { feature: "Maladie parent", importance: Math.round(weights.illness * illnessRisk * 100), value: illnessRisk * 100 },
  ].sort((a, b) => b.importance - a.importance);

  const factors: Factor[] = [];
  if (attendanceRisk <= 0.3) factors.push({ name: "Présence", impact: "positive", description: "Excellent taux de présence en cours" });
  else if (attendanceRisk > 0.5) factors.push({ name: "Présence", impact: "negative", description: "Taux de présence insuffisant" });
  if (averageRisk <= 0.3) factors.push({ name: "Moyenne", impact: "positive", description: "Bonne performance académique globale" });
  else if (averageRisk > 0.5) factors.push({ name: "Moyenne", impact: "negative", description: "Moyenne générale à renforcer" });
  if (homeworkRisk <= 0.3) factors.push({ name: "Devoirs", impact: "positive", description: "Bonne assiduité dans les devoirs" });
  else if (homeworkRisk > 0.5) factors.push({ name: "Devoirs", impact: "negative", description: "Devoirs souvent incomplets" });
  if (participationRisk <= 0.3) factors.push({ name: "Participation", impact: "positive", description: "Participation active en classe" });
  else if (participationRisk > 0.5) factors.push({ name: "Participation", impact: "negative", description: "Participation en classe insuffisante" });
  if (failedRisk >= 0.5) factors.push({ name: "Échecs", impact: "negative", description: "Plusieurs matières échouées" });
  else if (failedRisk === 0) factors.push({ name: "Échecs", impact: "positive", description: "Aucune matière échouée" });
  if (studyRisk <= 0.3) factors.push({ name: "Étude", impact: "positive", description: "Bon volume d'étude hebdomadaire" });
  else if (studyRisk > 0.6) factors.push({ name: "Étude", impact: "negative", description: "Temps d'étude insuffisant" });
  if (distanceRisk > 0.5) factors.push({ name: "Distance", impact: "negative", description: "Éloignement géographique important" });
  else if (distanceRisk <= 0.2) factors.push({ name: "Distance", impact: "positive", description: "Proximité avec l'établissement" });
  if (parentEduRisk > 0.5) factors.push({ name: "Éducation parentale", impact: "negative", description: "Faible niveau d'éducation des parents" });
  else if (parentEduRisk <= 0.2) factors.push({ name: "Éducation parentale", impact: "positive", description: "Bon niveau d'éducation des parents" });
  if (familyRisk > 0.3) factors.push({ name: "Situation familiale", impact: "negative", description: "Contexte familial difficile" });
  else factors.push({ name: "Situation familiale", impact: "positive", description: "Cadre familial stable" });
  if (input.parentIllness) factors.push({ name: "Maladie parentale", impact: "negative", description: "Parent atteint d'une maladie grave" });

  let diagnosis: string;
  if (riskScore <= 33) diagnosis = "L'étudiant présente un profil académique solide avec un faible risque de décrochage. Les indicateurs sont globalement positifs et encourageants.";
  else if (riskScore <= 66) diagnosis = "Le profil présente des signaux mixtes. Certains indicateurs nécessitent une attention particulière pour prévenir une détérioration des résultats.";
  else diagnosis = "Profil à risque élevé nécessitant une intervention pédagogique rapide. Plusieurs facteurs critiques ont été identifiés par notre modèle.";

  return { riskScore, riskLevel, recommendations, featureImportance, factors, diagnosis };
}

export function getDefaultInput(): PredictionInput {
  return {
    studentName: "",
    attendanceRate: 75,
    generalAverage: 12,
    homeworkRate: 70,
    classParticipation: 60,
    failedSubjects: 1,
    weeklyStudyHours: 15,
    distanceToSchool: 5,
    parentEducation: "secondaire",
    familySituation: "mariés",
    parentIllness: false,
  };
}

export function generateSimulatedData() {
  const riskDistribution = [
    { name: "Faible", value: 45, fill: "#2BA87A" },
    { name: "Moyen", value: 35, fill: "#E9A020" },
    { name: "Élevé", value: 20, fill: "#D93636" },
  ];

  const correlationData = Array.from({ length: 30 }, () => {
    const avg = Math.random() * 16 + 4;
    const risk = Math.max(5, Math.min(95, 100 - avg * 4.5 + (Math.random() - 0.5) * 25));
    return { average: parseFloat(avg.toFixed(1)), risk: Math.round(risk) };
  });

  const evolutionData = [
    { month: "Sep", risk: 45 },
    { month: "Oct", risk: 42 },
    { month: "Nov", risk: 48 },
    { month: "Déc", risk: 38 },
    { month: "Jan", risk: 35 },
    { month: "Fév", risk: 30 },
    { month: "Mar", risk: 28 },
  ];

  return { riskDistribution, correlationData, evolutionData };
}

export function parseCSV(csvText: string): PredictionInput[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(/[;,]/).map((h) => h.trim().toLowerCase());
  const students: PredictionInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/[;,]/).map((v) => v.trim());
    if (values.length < 2) continue;

    const get = (key: string) => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? values[idx] : "";
    };

    const parentEduMap: Record<string, PredictionInput["parentEducation"]> = {
      aucun: "aucun", primaire: "primaire", secondaire: "secondaire", "supérieur": "supérieur", superieur: "supérieur",
    };
    const familyMap: Record<string, PredictionInput["familySituation"]> = {
      "mariés": "mariés", maries: "mariés", "divorcés": "divorcés", divorces: "divorcés",
      "décès_un": "décès_un", deces_un: "décès_un", "décès_deux": "décès_deux", deces_deux: "décès_deux",
    };

    students.push({
      studentName: get("nom") || get("name") || get("étudiant") || get("etudiant") || `Étudiant ${i}`,
      attendanceRate: parseFloat(get("présence") || get("presence") || get("attendance") || "75") || 75,
      generalAverage: parseFloat(get("moyenne") || get("average") || "12") || 12,
      homeworkRate: parseFloat(get("devoirs") || get("homework") || "70") || 70,
      classParticipation: parseFloat(get("participation") || "60") || 60,
      failedSubjects: parseInt(get("échouées") || get("echouees") || get("failed") || "1") || 0,
      weeklyStudyHours: parseFloat(get("heures_étude") || get("heures_etude") || get("study_hours") || "15") || 15,
      distanceToSchool: parseFloat(get("distance") || "5") || 5,
      parentEducation: parentEduMap[get("éducation_parents") || get("education_parents") || "secondaire"] || "secondaire",
      familySituation: familyMap[get("situation_familiale") || get("famille") || "mariés"] || "mariés",
      parentIllness: ["oui", "yes", "true", "1"].includes((get("maladie_parent") || get("illness") || "non").toLowerCase()),
    });
  }

  return students;
}
