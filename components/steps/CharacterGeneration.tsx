"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ImageIcon,
  Download,
} from "lucide-react";
import { useStoryStore, useStepNavigation } from "@/store/useStoryStore";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function CharacterGeneration() {
  const { nextStep, prevStep } = useStepNavigation();
  const { childData, uploadedPhoto, generatedImages, setGeneratedImages } =
    useStoryStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCharacter = async () => {
    if (!uploadedPhoto) {
      toast.error("Please upload a photo first");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/character/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: uploadedPhoto.sessionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedImages(result.data.images);
        toast.success("Character images generated successfully!");
      } else {
        setError(result.error || "Failed to generate character images");
        toast.error(result.error || "Failed to generate character images");
      }
    } catch (error) {
      console.error("Character generation error:", error);
      const errorMsg = "Failed to generate character images. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const hasGeneratedImages = generatedImages && generatedImages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-magical rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Generate Character Images
        </h2>
        <p className="text-gray-600">
          Transform {childData?.childName}'s photo into magical story characters
        </p>
      </div>

      {/* Uploaded Photo Preview */}
      {uploadedPhoto && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={uploadedPhoto.previewUrl}
                  alt="Uploaded photo"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {childData?.childName}'s Photo
                </h3>
                <p className="text-sm text-gray-500">
                  Ready for character generation
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Status */}
      {!hasGeneratedImages && !generating && !error && (
        <div className="text-center mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ImageIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Ready to Generate Character Images
            </h3>
            <p className="text-blue-700">
              Click the button below to transform the uploaded photo into
              magical story characters.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {generating && (
        <div className="text-center mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Generating Character Images...
            </h3>
            <p className="text-purple-700">
              Our AI is working its magic to create beautiful character images.
              This may take a few moments.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Generation Failed
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={handleGenerateCharacter}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Generated Images */}
      {hasGeneratedImages && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generated Character Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={`Character ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Character Variation {index + 1}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {image.description || "Character image for your story"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {hasGeneratedImages && (
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-900">
                  Character Images Generated Successfully!
                </h3>
                <p className="text-green-700">
                  Your character images are ready. You can now proceed to
                  generate your PDF storybook.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Photo Upload
        </Button>

        {!hasGeneratedImages ? (
          <Button
            type="button"
            onClick={handleGenerateCharacter}
            disabled={!uploadedPhoto || generating}
            className="min-w-[200px]"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                Generate Character Images
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" onClick={nextStep} className="min-w-[200px]">
            Continue to PDF Generation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
