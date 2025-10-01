"use client";

import PhotoUploadAndGenerate from "@/components/steps/PhotoUploadAndGenerate";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            📚 Direct PDF Storybook Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo and generate a personalized PDF storybook instantly
          </p>
        </div>

        <PhotoUploadAndGenerate />
      </div>
    </div>
  );
}
