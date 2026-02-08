import { BookOpen, GraduationCap, BarChart3, Award, Brain, Calculator, FileText, PenTool } from "lucide-react";

const FloatingElements = () => {
  const elements = [
    { Icon: BookOpen, className: "top-[15%] left-[10%] animate-float-1", size: 32 },
    { Icon: GraduationCap, className: "top-[20%] right-[15%] animate-float-2", size: 36 },
    { Icon: BarChart3, className: "top-[50%] left-[5%] animate-float-3", size: 28 },
    { Icon: Award, className: "top-[60%] right-[10%] animate-float-1", size: 30 },
    { Icon: Brain, className: "top-[35%] right-[30%] animate-float-2", size: 34 },
    { Icon: Calculator, className: "top-[75%] left-[20%] animate-float-3", size: 26 },
    { Icon: FileText, className: "top-[10%] left-[45%] animate-float-2", size: 24 },
    { Icon: PenTool, className: "top-[80%] right-[25%] animate-float-1", size: 28 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map(({ Icon, className, size }, i) => (
        <div key={i} className={`absolute opacity-[0.12] text-primary-foreground ${className}`}>
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
