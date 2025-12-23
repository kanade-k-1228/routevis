import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  MapPin,
  PlayCircle,
  Terminal,
  Wifi,
} from "lucide-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useRoute } from "wouter";

// Import step components
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";

// Step configuration
interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  color: string;
}

const steps: StepConfig[] = [
  {
    id: 1,
    title: "Install Hardware",
    subtitle: "Build the foundation",
    icon: <Cpu className="w-6 h-6" />,
    component: <Step1 />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Hack CAN Bus",
    subtitle: "Take control",
    icon: <Wifi className="w-6 h-6" />,
    component: <Step2 />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Launch Joystick Mode",
    subtitle: "Manual override",
    icon: <Terminal className="w-6 h-6" />,
    component: <Step3 />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Tune PID Controllers",
    subtitle: "Precision control",
    icon: <Gauge className="w-6 h-6" />,
    component: <Step4 />,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "Design Test Route",
    subtitle: "Safety first",
    icon: <MapPin className="w-6 h-6" />,
    component: (
      <div className="text-gray-300 text-center py-20">
        Step 5 content coming soon...
      </div>
    ),
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    title: "Run Integration Tests",
    subtitle: "Ship it",
    icon: <PlayCircle className="w-6 h-6" />,
    component: (
      <div className="text-gray-300 text-center py-20">
        Step 6 content coming soon...
      </div>
    ),
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 7,
    title: "Analyze Results",
    subtitle: "Iterate & improve",
    icon: <BarChart3 className="w-6 h-6" />,
    component: (
      <div className="text-gray-300 text-center py-20">
        Step 7 content coming soon...
      </div>
    ),
    color: "from-violet-500 to-purple-500",
  },
];

export const Guide: FC = () => {
  const [, params] = useRoute("/guide/:step");
  const stepParam = params?.step ? parseInt(params.step, 10) : 0;
  const [currentStep, setCurrentStep] = useState(stepParam);

  // Update current step when URL changes
  useEffect(() => {
    if (stepParam >= 0 && stepParam < steps.length) {
      setCurrentStep(stepParam);
    }
  }, [stepParam]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      window.location.href = `/routevis/guide/${index}`;
    }
  }, []);

  const nextStep = useCallback(
    () => goToStep(currentStep + 1),
    [currentStep, goToStep],
  );
  const prevStep = useCallback(
    () => goToStep(currentStep - 1),
    [currentStep, goToStep],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentStep < steps.length - 1) nextStep();
      if (e.key === "ArrowLeft" && currentStep > 0) prevStep();
      if (e.key === "Escape") window.location.href = "/routevis/";
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, nextStep, prevStep]);

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${step.color}`}
                >
                  {step.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Step {currentStep + 1}: {step.title}
                  </h1>
                  <p className="text-sm text-gray-400">{step.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {steps.map((s, index) => (
                <button
                  key={`nav-${s.id}`}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    index === currentStep
                      ? `bg-gradient-to-r ${s.color} text-white`
                      : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
                  }`}
                  title={s.title}
                >
                  {s.icon}
                  <span className="text-sm font-medium">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-4">
            <div className="flex items-center space-x-1">
              {steps.map((_, index) => (
                <div
                  key={`progress-mobile-${index}`}
                  className={`h-1 flex-1 rounded transition-all ${
                    index <= currentStep
                      ? `bg-gradient-to-r ${step.color}`
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step Content */}
        {step.component}

        {/* Navigation Controls */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-slate-700 text-white hover:bg-slate-600 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {steps.map((_, index) => (
              <button
                type="button"
                key={`dot-${index}`}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  index === currentStep
                    ? `w-8 bg-gradient-to-r ${step.color}`
                    : index < currentStep
                      ? "w-2 bg-green-500"
                      : "w-2 bg-gray-600"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === steps.length - 1
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r " +
                  step.color +
                  " text-white hover:opacity-90 cursor-pointer"
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center pb-8 text-gray-500 text-sm">
        Use arrow keys to navigate • Press ESC to return home
      </div>
    </div>
  );
};
