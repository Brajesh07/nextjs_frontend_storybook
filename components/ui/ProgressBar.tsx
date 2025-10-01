"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  message?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  message,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {message || "Processing..."}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-magical h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
