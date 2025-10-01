import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  StoryStore,
  ChildData,
  StoryResult,
  StoryAnalysis,
  UploadResult,
  UploadedPhoto,
  GeneratedImage,
  DownloadData,
  StoryStep,
  ProgressState
} from '@/types';

// Initial state
const initialState = {
  childData: null,
  sessionId: null,
  storyResult: null,
  analysisResult: null,
  uploadResult: null,
  uploadedPhoto: null,
  generatedImages: [],
  downloadData: null,
  currentStep: 'form' as StoryStep,
  isLoading: false,
  error: null,
  progress: null,
};

// Create the store
export const useStoryStore = create<StoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        ...initialState,

        // Actions
        setChildData: (data: ChildData) => {
          set({ childData: data }, false, 'setChildData');
        },

        setSessionId: (id: string) => {
          set({ sessionId: id }, false, 'setSessionId');
        },

        setStoryResult: (result: StoryResult) => {
          set({ storyResult: result }, false, 'setStoryResult');
        },

        setAnalysisResult: (result: StoryAnalysis) => {
          set({ analysisResult: result }, false, 'setAnalysisResult');
        },

        setUploadResult: (result: UploadResult) => {
          set({ uploadResult: result }, false, 'setUploadResult');
        },

        setUploadedPhoto: (photo: UploadedPhoto) => {
          set({ uploadedPhoto: photo }, false, 'setUploadedPhoto');
        },

        setGeneratedImages: (images: GeneratedImage[]) => {
          set({ generatedImages: images }, false, 'setGeneratedImages');
        },

        setDownloadData: (data: DownloadData) => {
          set({ downloadData: data }, false, 'setDownloadData');
        },

        setCurrentStep: (step: StoryStep) => {
          set({ currentStep: step }, false, 'setCurrentStep');
        },

        setIsLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'setIsLoading');
        },

        setError: (error: string | null) => {
          set({ error }, false, 'setError');
        },

        setProgress: (progress: ProgressState | null) => {
          set({ progress }, false, 'setProgress');
        },

        resetStore: () => {
          set(initialState, false, 'resetStore');
        },
      }),
      {
        name: 'storybook-store',
        // Only persist essential data, not loading states
        partialize: (state) => ({
          childData: state.childData,
          sessionId: state.sessionId,
          storyResult: state.storyResult,
          analysisResult: state.analysisResult,
          uploadResult: state.uploadResult,
          generatedImages: state.generatedImages,
          downloadData: state.downloadData,
          currentStep: state.currentStep,
        }),
      }
    ),
    {
      name: 'storybook-store',
    }
  )
);

// Selectors for better performance
export const useChildData = () => useStoryStore((state) => state.childData);
export const useSessionId = () => useStoryStore((state) => state.sessionId);
export const useStoryResult = () => useStoryStore((state) => state.storyResult);
export const useAnalysisResult = () => useStoryStore((state) => state.analysisResult);
export const useUploadResult = () => useStoryStore((state) => state.uploadResult);
export const useGeneratedImages = () => useStoryStore((state) => state.generatedImages);
export const useDownloadData = () => useStoryStore((state) => state.downloadData);
export const useCurrentStep = () => useStoryStore((state) => state.currentStep);
export const useIsLoading = () => useStoryStore((state) => state.isLoading);
export const useError = () => useStoryStore((state) => state.error);
export const useProgress = () => useStoryStore((state) => state.progress);

// Action selectors
export const useStoryActions = () => useStoryStore((state) => ({
  setChildData: state.setChildData,
  setSessionId: state.setSessionId,
  setStoryResult: state.setStoryResult,
  setAnalysisResult: state.setAnalysisResult,
  setUploadResult: state.setUploadResult,
  setGeneratedImages: state.setGeneratedImages,
  setDownloadData: state.setDownloadData,
  setCurrentStep: state.setCurrentStep,
  setIsLoading: state.setIsLoading,
  setError: state.setError,
  setProgress: state.setProgress,
  resetStore: state.resetStore,
}));

// Computed selectors
export const useIsStoryGenerated = () => useStoryStore((state) => !!state.storyResult);
export const useIsPhotoUploaded = () => useStoryStore((state) => !!state.uploadResult);
export const useIsImagesGenerated = () => useStoryStore((state) => state.generatedImages.length > 0);
export const useIsPDFGenerated = () => useStoryStore((state) => !!state.downloadData);

// Progress calculation
export const useOverallProgress = () => useStoryStore((state) => {
  const steps = {
    form: state.childData ? 25 : 0,
    upload: state.uploadResult ? 50 : 25,
    generate: state.generatedImages.length > 0 ? 75 : 50,
    download: state.downloadData ? 100 : 75,
  };
  
  return Math.max(...Object.values(steps));
});

// Error handling
export const useClearError = () => useStoryStore((state) => () => state.setError(null));

// Step navigation helpers
export const useStepNavigation = () => {
  const currentStep = useCurrentStep();
  const { setCurrentStep } = useStoryActions();

  const canGoNext = useStoryStore((state) => {
    switch (state.currentStep) {
      case 'form':
        return !!state.childData;
      case 'upload':
        return !!state.uploadResult;
      case 'generate':
        return state.generatedImages.length > 0;
      case 'download':
        return false; // Last step
      default:
        return false;
    }
  });

  const canGoBack = currentStep !== 'form';

  const nextStep = () => {
    const stepOrder: StoryStep[] = ['form', 'upload', 'generate', 'download'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: StoryStep[] = ['form', 'upload', 'generate', 'download'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const goToStep = (step: StoryStep) => {
    setCurrentStep(step);
  };

  return {
    currentStep,
    canGoNext,
    canGoBack,
    nextStep,
    prevStep,
    goToStep,
  };
};

// Session management
export const useSessionManager = () => {
  const { resetStore, setSessionId } = useStoryActions();
  
  const startNewSession = () => {
    resetStore();
    // Generate a temporary client-side session ID
    const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(tempSessionId);
  };

  const restoreSession = (sessionId: string) => {
    setSessionId(sessionId);
  };

  return {
    startNewSession,
    restoreSession,
  };
};

export default useStoryStore;