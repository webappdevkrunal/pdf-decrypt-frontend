import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={`h-1 w-8 transition-all ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
