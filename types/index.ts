// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Child Data Types
export interface ChildData {
  childName: string;
  age: string;
  gender: 'boy' | 'girl';
  language: string;
  parentName: string;
  chapterCount: string; // Number of chapters to generate (as string for form handling)
}

// Story Types
export interface Chapter {
  chapterNumber: number;
  chapterText: string;
  fullChapterText: string;
}

export interface StoryResult {
  storyText: string;
  chapters: Chapter[];
  wordCount: number;
}

export interface StoryAnalysis {
  primaryTheme: string;
  ageCategory: string;
  enhancedPrompt?: string;
  chapterPrompts?: string[];
}

// Image Types
export interface GeneratedImage {
  chapterNumber: number;
  filename: string;
  url: string;
  prompt?: string;
  description?: string;
}

// Upload Types
export interface UploadedPhoto {
  filename: string;
  sessionId: string;
  previewUrl: string;
}

export interface UploadResult {
  imageUrl: string;
  provider: string;
}

// Session Types
export interface SessionData {
  sessionId: string;
  childData: ChildData;
  hasStory: boolean;
  hasUpload: boolean;
  hasImages: boolean;
  hasPDF: boolean;
  chapters: Chapter[];
  generatedImages: GeneratedImage[];
}

// Form Types
export interface StoryForm {
  childName: string;
  age: string;
  gender: 'boy' | 'girl';
  language: string;
  parentName: string;
}

// Step Types
export type StoryStep = 'form' | 'upload' | 'generate' | 'download';

// UI State Types
export interface UIState {
  currentStep: StoryStep;
  isLoading: boolean;
  error: string | null;
  progress: number;
}

// Generation Options
export interface GenerationOptions {
  generateMultiple: boolean;
  multiChapter: boolean;
}

// Download Types
export interface DownloadData {
  pdfFilename: string;
  downloadUrl: string;
}

// Progress Types
export interface ProgressState {
  step: StoryStep;
  message: string;
  percentage: number;
  isComplete: boolean;
}

// Error Types
export interface ErrorState {
  hasError: boolean;
  message: string;
  details?: string;
  code?: string;
}

// Theme Types
export type Theme = 'magic' | 'adventure' | 'friendship' | 'nature' | 'ocean' | 'space';

// Language Options
export const SUPPORTED_LANGUAGES = [
  'English',
  'Spanish', 
  'Hindi',
  'French',
  'German',
  'Chinese'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Age Categories
export type AgeCategory = 'toddler' | 'young_child' | 'child' | 'teen';

// File Upload Types
export interface FileUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

// Component Props Types
export interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  data?: any;
  onDataChange?: (data: any) => void;
}

// Store Types (for Zustand)
export interface StoryStore {
  // State
  childData: ChildData | null;
  sessionId: string | null;
  storyResult: StoryResult | null;
  analysisResult: StoryAnalysis | null;
  uploadResult: UploadResult | null;
  uploadedPhoto: UploadedPhoto | null;
  generatedImages: GeneratedImage[];
  downloadData: DownloadData | null;
  currentStep: StoryStep;
  isLoading: boolean;
  error: string | null;
  progress: ProgressState | null;

  // Actions
  setChildData: (data: ChildData) => void;
  setSessionId: (id: string) => void;
  setStoryResult: (result: StoryResult) => void;
  setAnalysisResult: (result: StoryAnalysis) => void;
  setUploadResult: (result: UploadResult) => void;
  setUploadedPhoto: (photo: UploadedPhoto) => void;
  setGeneratedImages: (images: GeneratedImage[]) => void;
  setDownloadData: (data: DownloadData) => void;
  setCurrentStep: (step: StoryStep) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: ProgressState | null) => void;
  resetStore: () => void;
}

// API Endpoint Types
export interface StoryGenerationRequest {
  childName: string;
  age: number;
  gender: 'boy' | 'girl';
  language: string;
  parentName: string;
  chapterCount: number; // Number of chapters to generate
}

export interface StoryGenerationResponse {
  sessionId: string;
  story: string;
  chapters: Chapter[];
  wordCount: number;
  analysisResult: StoryAnalysis;
}

export interface CharacterGenerationRequest {
  sessionId: string;
  generateMultiple?: boolean;
}

export interface CharacterGenerationResponse {
  singleImage: string | null;
  generatedImages: GeneratedImage[];
  totalImages: number;
}

export interface PDFGenerationRequest {
  sessionId: string;
  multiChapter?: boolean;
}

export interface PDFGenerationResponse {
  pdfFilename: string;
  downloadUrl: string;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};