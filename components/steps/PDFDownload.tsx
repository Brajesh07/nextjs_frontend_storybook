"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  BookOpen,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useStoryStore, useStepNavigation } from "@/store/useStoryStore";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { downloadFile } from "@/lib/utils";

export default function PDFDownload() {
  const { prevStep } = useStepNavigation();
  const {
    childData,
    uploadedPhoto,
    generatedImages,
    downloadData,
    setDownloadData,
  } = useStoryStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    if (!uploadedPhoto || !generatedImages?.length) {
      toast.error("Please complete previous steps first");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/pdf/generate", {
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
        setDownloadData({
          pdfFilename: result.data.metadata.title,
          downloadUrl: result.data.downloadUrl,
        });
        toast.success("PDF storybook generated successfully!");
      } else {
        setError(result.error || "Failed to generate PDF");
        toast.error(result.error || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      const errorMsg = "Failed to generate PDF storybook. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadData?.downloadUrl) {
      downloadFile(
        downloadData.downloadUrl,
        downloadData.pdfFilename || "storybook.pdf"
      );
      toast.success("Download started!");
    }
  };

  const hasDownloadData = downloadData?.downloadUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-magical rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Download Your Storybook
        </h2>
        <p className="text-gray-600">
          Generate and download {childData?.childName}'s personalized PDF
          storybook
        </p>
      </div>

      {/* Story Summary */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Story Summary
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Child's Name:</span>
              <span className="font-medium text-gray-900">
                {childData?.childName}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Age Group:</span>
              <span className="font-medium text-gray-900">
                {childData?.age}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Number of Chapters:</span>
              <span className="font-medium text-gray-900">
                {childData?.chapterCount || "8"} Chapters
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium text-gray-900">
                {childData?.language || "English"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Character Images:</span>
              <span className="font-medium text-gray-900">
                {generatedImages?.length || 0} Generated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation Status */}
      {!hasDownloadData && !generating && !error && (
        <div className="text-center mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Ready to Generate PDF Storybook
            </h3>
            <p className="text-blue-700 mb-4">
              Your personalized storybook will include the AI-generated story
              and character images.
            </p>
            <div className="bg-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                📚 What's Included:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 text-left max-w-md mx-auto">
                <li>
                  • Beautiful cover page with {childData?.childName}'s name
                </li>
                <li>• Complete personalized story</li>
                <li>• Character images on each page</li>
                <li>• Professional layout and formatting</li>
                <li>• High-quality PDF ready for printing</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {generating && (
        <div className="text-center mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Generating PDF Storybook...
            </h3>
            <p className="text-purple-700">
              Creating your beautiful storybook with all the images and text.
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
              PDF Generation Failed
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Success State with Download */}
      {hasDownloadData && (
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-green-900 mb-2">
                🎉 Your Storybook is Ready!
              </h3>

              <p className="text-green-700 mb-6">
                {childData?.childName}'s personalized storybook has been
                generated successfully.
              </p>

              <Button
                onClick={handleDownload}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF Storybook
              </Button>

              <p className="text-sm text-green-600 mt-4">
                The PDF is ready for viewing, sharing, or printing!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {hasDownloadData && (
        <div className="mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-semibold text-amber-900 mb-2">
              💡 Tips for Your Storybook:
            </h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Print on high-quality paper for the best results</li>
              <li>• Consider spiral binding for easier reading</li>
              <li>• Share with family and friends!</li>
              <li>• Create multiple stories with different themes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Character Generation
        </Button>

        {!hasDownloadData && (
          <Button
            type="button"
            onClick={handleGeneratePDF}
            disabled={!generatedImages?.length || generating}
            className="min-w-[200px]"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                Generate PDF Storybook
                <FileText className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {hasDownloadData && (
          <Button
            type="button"
            onClick={() => window.location.reload()}
            variant="outline"
            className="min-w-[200px]"
          >
            Create Another Story
          </Button>
        )}
      </div>
    </motion.div>
  );
}
