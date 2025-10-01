"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        const IconComponent = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isActive && "border-purple-500 bg-purple-500 text-white",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  !isActive &&
                    !isCompleted &&
                    "border-gray-300 bg-white text-gray-400"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-5 h-5" />
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors",
                  isActive && "text-purple-600",
                  isCompleted && "text-green-600",
                  !isActive && !isCompleted && "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    "h-0.5 w-12 transition-colors",
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
