import { useNavigate } from "react-router-dom";
import { Brain, BarChart3, Lightbulb, LayoutDashboard, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingElements from "@/components/FloatingElements";
import universityLogo from "@/assets/university-logo.png";
const features = [{
  icon: Brain,
  title: "Prédiction IA",
  description: "Algorithmes de Machine Learning (Random Forest, XGBoost) pour une prédiction précise du risque académique."
}, {
  icon: BarChart3,
  title: "Analyse Explicable",
  description: "Comprenez les facteurs clés grâce à l'IA explicable (XAI) et des visualisations détaillées."
}, {
  icon: Lightbulb,
  title: "Recommandations",
  description: "Recevez des recommandations pédagogiques personnalisées et exploitables."
}, {
  icon: LayoutDashboard,
  title: "Dashboard Interactif",
  description: "Tableaux de bord dynamiques avec graphiques, jauges et analyses en temps réel."
}];
const steps = [{
  num: "01",
  title: "Saisissez les données",
  desc: "Remplissez le formulaire avec les indicateurs académiques de l'étudiant."
}, {
  num: "02",
  title: "L'IA analyse",
  desc: "Notre modèle évalue les données et calcule le score de risque."
}, {
  num: "03",
  title: "Recevez les résultats",
  desc: "Consultez le dashboard avec prédictions, graphiques et recommandations."
}];
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
        <FloatingElements />
        <div className="container mx-auto px-4 relative z-10 text-center pt-20 pb-16">
          <div className="animate-fade-in-up">
            <img src={universityLogo} alt="AR PREDICT" className="h-20 mx-auto mb-8 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 animate-fade-in-up animate-delay-100">
            AR PREDICT
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-4 animate-fade-in-up animate-delay-200">
            Prédisez la réussite académique grâce à l'intelligence artificielle
          </p>
          <p className="text-sm md:text-base text-primary-foreground/60 max-w-xl mx-auto mb-10 animate-fade-in-up animate-delay-300">
            Analyse prédictive · Recommandations personnalisées · Dashboard interactif
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
            <Button variant="hero" size="xl" onClick={() => navigate("/prediction")} className="gap-2">
              Lancer une prédiction <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in-up animate-delay-500">
            {[{
            value: "95%",
            label: "Précision"
          }, {
            value: "6",
            label: "Variables"
          }, {
            value: "3",
            label: "Modèles IA"
          }].map((stat) => <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-accent">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60 mt-1">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Une plateforme <span className="text-gradient">intelligente</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Combinaison de Machine Learning supervisé et d'IA explicable pour accompagner la réussite des étudiants.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => <div key={feature.title} className="group bg-card rounded-xl p-6 border border-border hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: `${i * 100}ms`
          }}>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comment ça marche ?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Un processus simple en trois étapes pour obtenir une prédiction précise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => <div key={step.num} className="text-center animate-fade-in-up" style={{
            animationDelay: `${i * 150}ms`
          }}>
                <div className="text-5xl font-extrabold text-secondary/20 mb-4">{step.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <FloatingElements />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Prêt à prédire la réussite ?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Commencez dès maintenant avec notre outil de prédiction alimenté par l'intelligence artificielle.
          </p>
          <Button variant="hero" size="xl" onClick={() => navigate("/prediction")} className="gap-2">
            Commencer maintenant <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={universityLogo} alt="Logo" className="h-8" />
            <span className="font-semibold text-foreground">AR PREDICT</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ayoub rguig  
Master ITIAIP  
 École Supérieure de l'Éducation et de la Formation beni mellal</p>
        </div>
      </footer>
    </div>;
};
export default Index;
