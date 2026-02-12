/**
 * ML Pipeline Simulation Module
 * 
 * Simulates a complete Machine Learning pipeline following academic requirements:
 * - Multi-model comparison (Régression Logistique, Random Forest, XGBoost)
 * - GridSearchCV pour l'optimisation des hyperparamètres
 * - Métriques d'évaluation (Matrice de confusion, Rapport de classification)
 * - Apprentissage Ensembliste (Bagging/Boosting)
 * - Sélection automatique du meilleur modèle basé sur le F1-Score
 */

import type { PredictionInput } from "./prediction";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ModelMetrics {
  name: string;
  shortName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number; // ms
  confusionMatrix: number[][]; // 3x3 for Faible/Moyen/Élevé
  hyperparameters: Record<string, string | number>;
  regularization: string;
  ensembleMethod: string;
  isBestModel: boolean;
}

export interface PipelineStep {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  status: "pending" | "running" | "done";
  duration: number; // ms
  details: string[];
}

export interface PipelineResult {
  steps: PipelineStep[];
  models: ModelMetrics[];
  bestModel: ModelMetrics;
  datasetInfo: {
    totalSamples: number;
    trainSamples: number;
    testSamples: number;
    features: number;
    classes: string[];
    splitRatio: string;
    missingValues: number;
    encodedFeatures: string[];
  };
  featureImportanceByModel: Record<string, { feature: string; importance: number }[]>;
}

// ─── Constantes des noms de features ─────────────────────────────────────────

const FEATURE_NAMES = [
  "Taux de présence",
  "Moyenne générale",
  "Devoirs réalisés",
  "Participation",
  "Matières échouées",
  "Heures d'étude",
  "Distance école",
  "Éducation parents",
  "Situation familiale",
  "Maladie parent",
];

const CLASSES = ["Faible", "Moyen", "Élevé"];

// ─── Utilitaires de simulation réaliste ──────────────────────────────────────

function gaussianNoise(mean: number, stddev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return mean + stddev * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ─── Simulation de matrice de confusion ──────────────────────────────────────

function generateConfusionMatrix(accuracy: number, totalTest: number): number[][] {
  // Distribute samples across 3 classes with realistic distribution
  const classSizes = [
    Math.round(totalTest * 0.45), // Faible
    Math.round(totalTest * 0.35), // Moyen
    totalTest - Math.round(totalTest * 0.45) - Math.round(totalTest * 0.35), // Élevé
  ];

  const matrix: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const row: number[] = [0, 0, 0];
    const correct = Math.round(classSizes[i] * clamp(accuracy + gaussianNoise(0, 0.05), 0.5, 0.99));
    row[i] = correct;
    const remaining = classSizes[i] - correct;
    // Distribute errors to adjacent classes
    const otherClasses = [0, 1, 2].filter((c) => c !== i);
    row[otherClasses[0]] = Math.round(remaining * (0.4 + Math.random() * 0.3));
    row[otherClasses[1]] = remaining - row[otherClasses[0]];
    matrix.push(row);
  }
  return matrix;
}

// ─── Génération des métriques par modèle ─────────────────────────────────────

function generateLogisticRegression(testSize: number): ModelMetrics {
  const accuracy = clamp(gaussianNoise(0.78, 0.03), 0.70, 0.88);
  const precision = clamp(accuracy + gaussianNoise(0.01, 0.02), 0.68, 0.90);
  const recall = clamp(accuracy + gaussianNoise(-0.02, 0.03), 0.65, 0.88);
  const f1 = 2 * (precision * recall) / (precision + recall);

  return {
    name: "Régression Logistique",
    shortName: "LogReg",
    accuracy: parseFloat(accuracy.toFixed(4)),
    precision: parseFloat(precision.toFixed(4)),
    recall: parseFloat(recall.toFixed(4)),
    f1Score: parseFloat(f1.toFixed(4)),
    trainingTime: Math.round(gaussianNoise(120, 30)),
    confusionMatrix: generateConfusionMatrix(accuracy, testSize),
    hyperparameters: {
      C: 0.1,
      max_iter: 1000,
      solver: "lbfgs",
      penalty: "l2",
      multi_class: "multinomial",
    },
    regularization: "L2 (Ridge) — Régularisation pour prévenir le surapprentissage",
    ensembleMethod: "Aucun (modèle de base linéaire)",
    isBestModel: false,
  };
}

function generateRandomForest(testSize: number): ModelMetrics {
  const accuracy = clamp(gaussianNoise(0.87, 0.025), 0.80, 0.94);
  const precision = clamp(accuracy + gaussianNoise(0.02, 0.015), 0.80, 0.96);
  const recall = clamp(accuracy + gaussianNoise(-0.01, 0.02), 0.78, 0.93);
  const f1 = 2 * (precision * recall) / (precision + recall);

  return {
    name: "Random Forest",
    shortName: "RF",
    accuracy: parseFloat(accuracy.toFixed(4)),
    precision: parseFloat(precision.toFixed(4)),
    recall: parseFloat(recall.toFixed(4)),
    f1Score: parseFloat(f1.toFixed(4)),
    trainingTime: Math.round(gaussianNoise(350, 80)),
    confusionMatrix: generateConfusionMatrix(accuracy, testSize),
    hyperparameters: {
      n_estimators: 200,
      max_depth: 12,
      min_samples_split: 5,
      min_samples_leaf: 2,
      max_features: "sqrt",
    },
    regularization: "Limitation de profondeur (max_depth) + min_samples — contre le surapprentissage",
    ensembleMethod: "Bagging — Agrégation de multiples arbres de décision",
    isBestModel: false,
  };
}

function generateXGBoost(testSize: number): ModelMetrics {
  const accuracy = clamp(gaussianNoise(0.90, 0.02), 0.84, 0.96);
  const precision = clamp(accuracy + gaussianNoise(0.01, 0.015), 0.84, 0.97);
  const recall = clamp(accuracy + gaussianNoise(0.005, 0.02), 0.82, 0.95);
  const f1 = 2 * (precision * recall) / (precision + recall);

  return {
    name: "XGBoost",
    shortName: "XGB",
    accuracy: parseFloat(accuracy.toFixed(4)),
    precision: parseFloat(precision.toFixed(4)),
    recall: parseFloat(recall.toFixed(4)),
    f1Score: parseFloat(f1.toFixed(4)),
    trainingTime: Math.round(gaussianNoise(280, 60)),
    confusionMatrix: generateConfusionMatrix(accuracy, testSize),
    hyperparameters: {
      n_estimators: 300,
      max_depth: 8,
      learning_rate: 0.05,
      subsample: 0.8,
      colsample_bytree: 0.8,
      reg_alpha: 0.1,
      reg_lambda: 1.0,
    },
    regularization: "L1 (reg_alpha) + L2 (reg_lambda) + learning_rate réduit — Régularisation forte",
    ensembleMethod: "Boosting (Gradient Boosting) — Apprentissage séquentiel corrigeant les erreurs",
    isBestModel: false,
  };
}

// ─── Feature importance par modèle ───────────────────────────────────────────

function generateFeatureImportance(): { feature: string; importance: number }[] {
  const rawImportances = FEATURE_NAMES.map(() => Math.random());
  const total = rawImportances.reduce((a, b) => a + b, 0);
  return FEATURE_NAMES.map((f, i) => ({
    feature: f,
    importance: parseFloat((rawImportances[i] / total).toFixed(4)),
  })).sort((a, b) => b.importance - a.importance);
}

// ─── Pipeline principal ──────────────────────────────────────────────────────

export function runPipeline(): PipelineResult {
  const totalSamples = 500;
  const trainRatio = 0.8;
  const trainSamples = Math.round(totalSamples * trainRatio);
  const testSamples = totalSamples - trainSamples;

  // Generate model metrics
  const logReg = generateLogisticRegression(testSamples);
  const rf = generateRandomForest(testSamples);
  const xgb = generateXGBoost(testSamples);

  const models = [logReg, rf, xgb];

  // Select best model by F1-Score
  const bestIdx = models.reduce((best, m, i) => (m.f1Score > models[best].f1Score ? i : best), 0);
  models[bestIdx].isBestModel = true;

  // Pipeline steps
  const steps: PipelineStep[] = [
    {
      id: "load",
      name: "Data Loading",
      nameFr: "Chargement des données",
      description: "Importation du jeu de données via Pandas (pd.read_csv)",
      status: "done",
      duration: 45,
      details: [
        `Dataset: ${totalSamples} échantillons, ${FEATURE_NAMES.length} variables`,
        "Format: CSV encodé UTF-8",
        "Bibliothèque: pandas.read_csv()",
      ],
    },
    {
      id: "preprocess",
      name: "Preprocessing",
      nameFr: "Prétraitement des données",
      description: "Nettoyage, gestion des valeurs manquantes et encodage catégoriel",
      status: "done",
      duration: 120,
      details: [
        "Valeurs manquantes traitées : imputation par la médiane (SimpleImputer)",
        "Encodage catégoriel : LabelEncoder pour parentEducation, familySituation",
        "Normalisation : StandardScaler sur les variables numériques",
        "Variables booléennes converties en 0/1",
      ],
    },
    {
      id: "split",
      name: "Train/Test Split",
      nameFr: "Séparation Train/Test",
      description: `Division du jeu de données (${Math.round(trainRatio * 100)}% / ${Math.round((1 - trainRatio) * 100)}%)`,
      status: "done",
      duration: 15,
      details: [
        `train_test_split(X, y, test_size=${(1 - trainRatio).toFixed(1)}, random_state=42, stratify=y)`,
        `Ensemble d'entraînement : ${trainSamples} échantillons`,
        `Ensemble de test : ${testSamples} échantillons`,
        "Stratification activée pour préserver la distribution des classes",
      ],
    },
    {
      id: "train",
      name: "Model Training",
      nameFr: "Entraînement des modèles",
      description: "Entraînement de 3 modèles avec GridSearchCV pour l'optimisation des hyperparamètres",
      status: "done",
      duration: models.reduce((s, m) => s + m.trainingTime, 0),
      details: [
        "Modèle 1 : Régression Logistique (.fit() avec régularisation L2)",
        "Modèle 2 : Random Forest (Bagging, 200 arbres, .fit())",
        "Modèle 3 : XGBoost (Boosting, 300 estimateurs, .fit())",
        "Optimisation : GridSearchCV(cv=5, scoring='f1_weighted')",
        "Protection contre le surapprentissage : validation croisée + régularisation",
      ],
    },
    {
      id: "predict",
      name: "Prediction",
      nameFr: "Prédiction",
      description: "Inférence sur l'ensemble de test avec .predict()",
      status: "done",
      duration: 30,
      details: [
        "y_pred = model.predict(X_test) pour chaque modèle",
        `Prédictions sur ${testSamples} échantillons`,
        "Classes prédites : Faible, Moyen, Élevé",
      ],
    },
    {
      id: "evaluate",
      name: "Evaluation",
      nameFr: "Évaluation des modèles",
      description: "Calcul des métriques de performance et génération des rapports",
      status: "done",
      duration: 80,
      details: [
        "Matrice de confusion : confusion_matrix(y_test, y_pred)",
        "Rapport de classification : classification_report(precision, recall, f1)",
        "Score global : accuracy_score(y_test, y_pred)",
        `Meilleur modèle sélectionné : ${models[bestIdx].name} (F1=${models[bestIdx].f1Score.toFixed(4)})`,
      ],
    },
  ];

  // Feature importance per model
  const featureImportanceByModel: Record<string, { feature: string; importance: number }[]> = {};
  models.forEach((m) => {
    featureImportanceByModel[m.shortName] = generateFeatureImportance();
  });

  return {
    steps,
    models,
    bestModel: models[bestIdx],
    datasetInfo: {
      totalSamples,
      trainSamples,
      testSamples,
      features: FEATURE_NAMES.length,
      classes: CLASSES,
      splitRatio: `${Math.round(trainRatio * 100)}/${Math.round((1 - trainRatio) * 100)}`,
      missingValues: Math.round(gaussianNoise(12, 4)),
      encodedFeatures: ["parentEducation", "familySituation", "parentIllness"],
    },
    featureImportanceByModel,
  };
}

// ─── Extrapolation: test hors-plage ──────────────────────────────────────────

export interface ExtrapolationResult {
  input: Partial<PredictionInput>;
  predictions: { model: string; riskLevel: string; confidence: number }[];
  warning: string;
}

export function testExtrapolation(input: Partial<PredictionInput>): ExtrapolationResult {
  const warnings: string[] = [];
  if (input.attendanceRate !== undefined && (input.attendanceRate > 100 || input.attendanceRate < 0))
    warnings.push("Taux de présence hors limites [0-100]");
  if (input.generalAverage !== undefined && (input.generalAverage > 20 || input.generalAverage < 0))
    warnings.push("Moyenne hors limites [0-20]");
  if (input.weeklyStudyHours !== undefined && input.weeklyStudyHours > 60)
    warnings.push("Heures d'étude anormalement élevées (>60h)");
  if (input.distanceToSchool !== undefined && input.distanceToSchool > 100)
    warnings.push("Distance extrême (>100km)");

  const models = ["Régression Logistique", "Random Forest", "XGBoost"];
  const predictions = models.map((model) => {
    const baseConf = model === "XGBoost" ? 0.85 : model === "Random Forest" ? 0.80 : 0.72;
    const degradation = warnings.length * 0.12;
    const confidence = clamp(baseConf - degradation + gaussianNoise(0, 0.05), 0.3, 0.95);
    const levels = ["Faible", "Moyen", "Élevé"];
    return {
      model,
      riskLevel: levels[Math.floor(Math.random() * 3)],
      confidence: parseFloat(confidence.toFixed(3)),
    };
  });

  return {
    input,
    predictions,
    warning: warnings.length > 0
      ? `⚠ Données hors plage détectées : ${warnings.join("; ")}. La robustesse des modèles peut être affectée.`
      : "✓ Données dans la plage normale.",
  };
}
