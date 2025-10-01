'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Wand2 } from 'lucide-react';
import { useStoryStore, useStepNavigation } from '@/store/useStoryStore';
import StoryForm from '@/components/steps/StoryForm';
import PhotoUploadAndGenerate from '@/components/steps/PhotoUploadAndGenerate';
import ProgressBar from '@/components/ui/ProgressBar';
import StepIndicator from '@/components/ui/StepIndicator';

const steps = [
  { id: 'form', title: 'Story Details', icon: BookOpen },
  { id: 'upload', title: 'Upload & Generate', icon: Wand2 },
];

export default function HomePage() {
  const { currentStep } = useStepNavigation();
  const progress = useStoryStore((state) => state.progress);

  const renderStep = () => {
    switch (currentStep) {
      case 'form':
        return <StoryForm />;
      case 'upload':
        return <PhotoUploadAndGenerate />;
      default:
        return <StoryForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-magical p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Storybook Generator
              </h1>
            </div>
            
            <div className="hidden md:block">
              <StepIndicator steps={steps} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {progress && (
        <ProgressBar 
          progress={progress.percentage} 
          message={progress.message}
          className="mx-4 mt-4"
        />
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Step Content */}
          <div className="p-8">
            {renderStep()}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Creating magical stories with the power of AI ✨
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Made with ❤️ for children everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}