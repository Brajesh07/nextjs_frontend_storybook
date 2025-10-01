import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ApiClient, getErrorMessage } from '@/lib/api';
import { useStoryActions } from '@/store/useStoryStore';
import {
  StoryGenerationRequest,
  CharacterGenerationRequest,
  PDFGenerationRequest,
  ProgressState
} from '@/types';

// Story Generation Hook
export const useGenerateStory = () => {
  const { 
    setSessionId, 
    setStoryResult, 
    setAnalysisResult, 
    setIsLoading, 
    setError,
    setProgress 
  } = useStoryActions();

  return useMutation({
    mutationFn: async (data: StoryGenerationRequest) => {
      setIsLoading(true);
      setError(null);
      setProgress({
        step: 'form',
        message: 'Generating your personalized story...',
        percentage: 20,
        isComplete: false
      });

      const result = await ApiClient.generateStory(data);
      
      setProgress({
        step: 'form',
        message: 'Story generated successfully!',
        percentage: 100,
        isComplete: true
      });

      return result;
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setStoryResult({
        storyText: data.story,
        chapters: data.chapters,
        wordCount: data.wordCount
      });
      setAnalysisResult(data.analysisResult);
      setIsLoading(false);
      setProgress(null);
      toast.success('Story generated successfully! 📚');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError(message);
      setIsLoading(false);
      setProgress(null);
      toast.error(`Failed to generate story: ${message}`);
    },
  });
};

// Photo Upload Hook
export const useUploadPhoto = () => {
  const { 
    setUploadResult, 
    setIsLoading, 
    setError,
    setProgress 
  } = useStoryActions();

  return useMutation({
    mutationFn: async ({ file, sessionId }: { file: File; sessionId: string }) => {
      setIsLoading(true);
      setError(null);
      setProgress({
        step: 'upload',
        message: 'Uploading your photo...',
        percentage: 30,
        isComplete: false
      });

      const result = await ApiClient.uploadPhoto(file, sessionId);
      
      setProgress({
        step: 'upload',
        message: 'Photo uploaded successfully!',
        percentage: 100,
        isComplete: true
      });

      return result;
    },
    onSuccess: (data) => {
      setUploadResult(data);
      setIsLoading(false);
      setProgress(null);
      toast.success('Photo uploaded successfully! 📸');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError(message);
      setIsLoading(false);
      setProgress(null);
      toast.error(`Failed to upload photo: ${message}`);
    },
  });
};

// Character Generation Hook
export const useGenerateCharacter = () => {
  const { 
    setGeneratedImages, 
    setIsLoading, 
    setError,
    setProgress 
  } = useStoryActions();

  return useMutation({
    mutationFn: async (data: CharacterGenerationRequest) => {
      setIsLoading(true);
      setError(null);
      
      const progressMessages = data.generateMultiple 
        ? [
            { percentage: 20, message: 'Analyzing your story chapters...' },
            { percentage: 40, message: 'Creating character variations...' },
            { percentage: 60, message: 'Generating chapter-specific images...' },
            { percentage: 80, message: 'Adding magical touches...' },
          ]
        : [
            { percentage: 30, message: 'Analyzing your photo...' },
            { percentage: 60, message: 'Creating your character...' },
            { percentage: 90, message: 'Adding finishing touches...' },
          ];

      // Simulate progress updates
      for (const progress of progressMessages) {
        setProgress({
          step: 'generate',
          message: progress.message,
          percentage: progress.percentage,
          isComplete: false
        });
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const result = await ApiClient.generateCharacterImages(data);
      
      setProgress({
        step: 'generate',
        message: 'Character images generated successfully!',
        percentage: 100,
        isComplete: true
      });

      return result;
    },
    onSuccess: (data) => {
      setGeneratedImages(data.generatedImages);
      setIsLoading(false);
      setProgress(null);
      
      const message = data.totalImages > 1 
        ? `${data.totalImages} character images generated! 🎨`
        : 'Character image generated! 🎨';
      
      toast.success(message);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError(message);
      setIsLoading(false);
      setProgress(null);
      toast.error(`Failed to generate character: ${message}`);
    },
  });
};

// PDF Generation Hook
export const useGeneratePDF = () => {
  const { 
    setDownloadData, 
    setIsLoading, 
    setError,
    setProgress 
  } = useStoryActions();

  return useMutation({
    mutationFn: async (data: PDFGenerationRequest) => {
      setIsLoading(true);
      setError(null);
      setProgress({
        step: 'download',
        message: 'Creating your storybook PDF...',
        percentage: 30,
        isComplete: false
      });

      // Simulate PDF generation progress
      setTimeout(() => {
        setProgress({
          step: 'download',
          message: 'Adding images to your storybook...',
          percentage: 60,
          isComplete: false
        });
      }, 1000);

      setTimeout(() => {
        setProgress({
          step: 'download',
          message: 'Formatting your beautiful storybook...',
          percentage: 80,
          isComplete: false
        });
      }, 2000);

      const result = await ApiClient.generatePDF(data);
      
      setProgress({
        step: 'download',
        message: 'Storybook PDF ready for download!',
        percentage: 100,
        isComplete: true
      });

      return result;
    },
    onSuccess: (data) => {
      setDownloadData(data);
      setIsLoading(false);
      setProgress(null);
      toast.success('PDF storybook generated! 📖 Ready for download!');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setError(message);
      setIsLoading(false);
      setProgress(null);
      toast.error(`Failed to generate PDF: ${message}`);
    },
  });
};

// Session Data Hook
export const useSessionData = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => ApiClient.getSessionData(sessionId!),
    enabled: !!sessionId && sessionId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: ApiClient.healthCheck,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

// PDF Download Hook
export const useDownloadPDF = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const blob = await ApiClient.downloadPDF(sessionId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'storybook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    },
    onSuccess: () => {
      toast.success('PDF downloaded successfully! 📥');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(`Failed to download PDF: ${message}`);
    },
  });
};

// Combined workflow hook for easier management
export const useStoryWorkflow = () => {
  const generateStory = useGenerateStory();
  const uploadPhoto = useUploadPhoto();
  const generateCharacter = useGenerateCharacter();
  const generatePDF = useGeneratePDF();
  const downloadPDF = useDownloadPDF();

  const isAnyLoading = 
    generateStory.isPending ||
    uploadPhoto.isPending ||
    generateCharacter.isPending ||
    generatePDF.isPending ||
    downloadPDF.isPending;

  const hasAnyError = 
    generateStory.isError ||
    uploadPhoto.isError ||
    generateCharacter.isError ||
    generatePDF.isError ||
    downloadPDF.isError;

  const reset = () => {
    generateStory.reset();
    uploadPhoto.reset();
    generateCharacter.reset();
    generatePDF.reset();
    downloadPDF.reset();
  };

  return {
    generateStory,
    uploadPhoto,
    generateCharacter,
    generatePDF,
    downloadPDF,
    isAnyLoading,
    hasAnyError,
    reset,
  };
};