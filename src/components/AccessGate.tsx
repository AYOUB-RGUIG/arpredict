import { useState, useRef, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import universityLogo from "@/assets/university-logo.png";

const PIN_CODE = "1974";
const PIN_LENGTH = 4;

const AccessGate = ({ onSuccess }: { onSuccess: () => void }) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check PIN when all digits entered
    const pin = newDigits.join("");
    if (pin.length === PIN_LENGTH) {
      if (pin === PIN_CODE) {
        setSuccess(true);
        setTimeout(onSuccess, 600);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] gradient-hero flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-foreground/5 animate-float-1"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <img
          src={universityLogo}
          alt="AR PREDICT"
          className="h-16 mx-auto mb-6 drop-shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-2">
          AR PREDICT
        </h1>
        <p className="text-primary-foreground/60 text-sm mb-8">
          Veuillez entrer le code d'accès pour continuer
        </p>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock className="h-4 w-4 text-primary-foreground/40" />
          <span className="text-xs text-primary-foreground/40 uppercase tracking-widest">
            Code PIN
          </span>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm outline-none transition-all duration-200 ${
                success
                  ? "border-green-400 bg-green-400/20"
                  : error
                    ? "border-red-400 bg-red-400/10 animate-pulse"
                    : digit
                      ? "border-primary-foreground/40"
                      : "border-primary-foreground/20 focus:border-primary-foreground/50"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-300 text-sm animate-fade-in-up">
            Code incorrect. Veuillez réessayer.
          </p>
        )}
        {success && (
          <div className="flex items-center justify-center gap-2 text-green-300 animate-fade-in-up">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Accès autorisé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessGate;
