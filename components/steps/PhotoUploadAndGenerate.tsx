"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  ArrowLeft,
  ImageIcon,
  X,
  Download,
  Sparkles,
} from "lucide-react";
import { useStoryStore, useStepNavigation } from "@/store/useStoryStore";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function PhotoUploadAndGenerate() {
  const { prevStep } = useStepNavigation();
  const {
    childData,
    storyResult,
    analysisResult,
    setUploadedPhoto,
    generatedImages,
    setGeneratedImages,
    setDownloadData,
  } = useStoryStore();

  // Upload states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPhoto, setUploadedPhotoLocal] = useState<any>(null);

  // Generation states
  const [generating, setGenerating] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File handling
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Step 1: Upload photo
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      const photoData = {
        filename: uploadResult.data.uploadedFile,
        sessionId: uploadResult.data.sessionId,
        previewUrl: previewUrl!,
      };

      setUploadedPhoto(photoData);
      setUploadedPhotoLocal(photoData);

      toast.success("Photo uploaded successfully!");
      setUploading(false);

      // Step 2: Generate character images
      setGenerating(true);

      const generateResponse = await fetch("/api/character/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: uploadResult.data.sessionId,
        }),
      });

      const generateResult = await generateResponse.json();

      if (!generateResult.success) {
        throw new Error(
          generateResult.error || "Failed to generate character images"
        );
      }

      setGeneratedImages(generateResult.data.images);
      toast.success("Character images generated successfully!");
      setGenerating(false);

      // Step 3: Generate PDF
      setGeneratingPDF(true);

      const pdfResponse = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: uploadResult.data.sessionId,
        }),
      });

      const pdfResult = await pdfResponse.json();

      if (!pdfResult.success) {
        throw new Error(pdfResult.error || "Failed to generate PDF");
      }

      setDownloadData({
        pdfFilename: pdfResult.data.metadata.title,
        downloadUrl: pdfResult.data.downloadUrl,
      });

      setGeneratingPDF(false);
      setShowResults(true);
      toast.success("PDF storybook generated successfully!");
    } catch (error) {
      console.error("Process error:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Process failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      setUploading(false);
      setGenerating(false);
      setGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!uploadedPhoto) return;

    try {
      const response = await fetch(
        `/api/pdf/download/${uploadedPhoto.sessionId}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${childData?.childName || "story"}-storybook.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleCreateAnother = () => {
    window.location.href = "/";
  };

  const isProcessing = uploading || generating || generatingPDF;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-magical rounded-full mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Upload Photo & Generate Storybook
        </h2>
        <p className="text-gray-600">
          Upload {childData?.childName}'s photo to create a complete
          personalized storybook
        </p>
      </div>
      {/* Enhanced Story Summary with Character Prompts */}
      {storyResult && (
        <>
          {/* Basic Story Summary */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📖 Your Story Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <strong>Child:</strong> {childData?.childName}
              </div>
              <div>
                <strong>Theme:</strong> {childData?.genre}
              </div>
              <div>
                <strong>Interests:</strong> {childData?.interests}
              </div>
              <div>
                <strong>Story Theme:</strong> {childData?.storyTheme}
              </div>
            </div>

            {/* AI Analysis Results */}
            {analysisResult && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-yellow-800 font-semibold mb-3 flex items-center">
                  🔍 AI Story Analysis
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {analysisResult.primaryTheme} Theme
                  </span>
                  <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {analysisResult.ageCategory}
                  </span>
                </div>

                {analysisResult.enhancedPrompt && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg font-mono text-sm">
                    <strong className="text-blue-800">
                      Enhanced Character Prompt:
                    </strong>
                    <br />
                    <span className="text-blue-700 leading-relaxed">
                      {analysisResult.enhancedPrompt}
                    </span>
                  </div>
                )}
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-purple-600 font-medium hover:text-purple-700">
                📚 View Full Story ({storyResult.wordCount} words)
              </summary>
              <div className="mt-3 p-4 bg-white rounded-lg border text-sm leading-relaxed">
                {storyResult.storyText}
              </div>
            </details>
          </div>

          {/* Character Prompts and Chapter Display */}
          {analysisResult?.chapterPrompts &&
            analysisResult.chapterPrompts.length > 0 && (
              <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-green-800 font-bold text-xl mb-5 flex items-center">
                  🎭 {analysisResult.chapterPrompts.length} Character Prompts &
                  Story Chapters
                </h3>

                {/* Character Prompts List */}
                <div className="mb-6">
                  <h4 className="text-blue-700 font-semibold text-lg mb-4">
                    Character Prompts:
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.chapterPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 border-l-4 border-blue-500 rounded-r-lg shadow-sm"
                      >
                        <strong className="text-blue-800">
                          Character {index + 1}:
                        </strong>
                        <span className="ml-2 text-gray-700 font-medium">
                          "{prompt}"
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Story Chapters */}
                {storyResult.chapters && storyResult.chapters.length > 0 && (
                  <div>
                    <h4 className="text-blue-700 font-semibold text-lg mb-4">
                      Story:
                    </h4>
                    <div className="bg-white p-4 rounded-lg border font-mono text-sm leading-relaxed space-y-4">
                      {storyResult.chapters.map((chapter, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-200 pb-3 last:border-b-0"
                        >
                          <strong className="text-purple-700">
                            Chapter {chapter.chapterNumber}:
                          </strong>
                          <div className="mt-2 text-gray-800">
                            {chapter.fullChapterText || chapter.chapterText}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
        </>
      )}{" "}
      {!showResults ? (
        <>
          {/* File Upload Section */}
          {!uploadedPhoto && (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors mb-8 ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />

              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-16 h-16 text-gray-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your photo here, or click to browse
                  </h3>
                  <p className="text-gray-500">
                    Supports JPEG, PNG, GIF, and WebP files up to 5MB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  disabled={isProcessing}
                >
                  Choose File
                </Button>
              </div>
            </div>
          )}

          {/* File Preview */}
          {selectedFile && previewUrl && (
            <div className="mb-8">
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6">
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={isProcessing}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Ready to generate storybook
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {uploading && "Uploading photo..."}
                  {generating && "Generating character images..."}
                  {generatingPDF && "Creating PDF storybook..."}
                </h3>
                <p className="text-purple-700">
                  {uploading && "Uploading your photo to our secure servers."}
                  {generating &&
                    "Our AI is creating magical character illustrations."}
                  {generatingPDF &&
                    "Assembling your complete storybook with images."}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Process Failed
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button
                  onClick={handleUploadAndGenerate}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={!selectedFile}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {selectedFile && !isProcessing && !error && (
            <div className="text-center mb-8">
              <Button
                onClick={handleUploadAndGenerate}
                disabled={!selectedFile || isProcessing}
                className="min-w-[300px] h-14 text-lg"
              >
                <Sparkles className="mr-3 h-5 w-5" />
                Generate Complete Storybook
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                This will upload your photo, generate character images, and
                create a PDF storybook
              </p>
            </div>
          )}
        </>
      ) : (
        /* Results Section */
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              🎉 Your Storybook is Ready!
            </h3>
            <p className="text-green-700 mb-6">
              Your personalized storybook with character images has been
              generated successfully.
            </p>

            {/* Generated Images Preview */}
            {generatedImages && generatedImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Character Images Generated ({generatedImages.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={`Character ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900">
                          Chapter {image.chapterNumber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownloadPDF} className="min-w-[200px]">
                <Download className="mr-2 h-4 w-4" />
                Download PDF Storybook
              </Button>

              <Button
                onClick={handleCreateAnother}
                variant="outline"
                className="min-w-[200px]"
              >
                🔄 Create Another Story
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Back Button */}
      <div className="flex justify-start pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Story Details
        </Button>
      </div>
    </motion.div>
  );
}
