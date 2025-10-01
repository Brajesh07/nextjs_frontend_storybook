"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
  X,
} from "lucide-react";
import { useStoryStore, useStepNavigation } from "@/store/useStoryStore";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function PhotoUpload() {
  const { nextStep, prevStep } = useStepNavigation();
  const { childData, uploadedPhoto, setUploadedPhoto } = useStoryStore();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedPhoto({
          filename: result.data.uploadedFile,
          sessionId: result.data.sessionId,
          previewUrl: previewUrl!,
        });

        toast.success("Photo uploaded successfully!");
        nextStep();
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-magical rounded-full mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Upload {childData?.childName}'s Photo
        </h2>
        <p className="text-gray-600">
          Upload a clear photo of your child to generate their character in the
          story
        </p>
      </div>

      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
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

            <Button type="button" variant="outline" className="mt-4">
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative bg-white rounded-2xl border border-gray-200 p-6">
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-green-600 mt-1">✓ Ready to upload</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📸 Photo Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Use a clear, well-lit photo with your child's face visible
              </li>
              <li>• Avoid photos with multiple people or busy backgrounds</li>
              <li>• Front-facing photos work best for character generation</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Story Details
        </Button>

        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="min-w-[200px]"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              Continue to Generate Character
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
