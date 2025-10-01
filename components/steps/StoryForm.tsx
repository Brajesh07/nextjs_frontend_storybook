"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useStoryStore, useStepNavigation } from "@/store/useStoryStore";
import { useGenerateStory } from "@/hooks/useStoryApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const languages = [
  "English",
  "Spanish",
  "Hindi",
  "French",
  "German",
  "Chinese",
];

const ages = Array.from({ length: 11 }, (_, i) => i + 2); // 2 to 12

export default function StoryForm() {
  const { nextStep } = useStepNavigation();
  const { childData, setChildData, isLoading } = useStoryStore();
  const generateStory = useGenerateStory();

  const [formData, setFormData] = useState({
    childName: childData?.childName || "",
    age: childData?.age || "",
    gender: childData?.gender || "",
    language: childData?.language || "",
    parentName: childData?.parentName || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.childName.trim()) {
      newErrors.childName = "Child name is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.language) {
      newErrors.language = "Story language is required";
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const childDataToSave = {
      childName: formData.childName.trim(),
      age: formData.age,
      gender: formData.gender as "boy" | "girl",
      language: formData.language,
      parentName: formData.parentName.trim(),
    };

    // Save child data to store
    setChildData(childDataToSave);

    try {
      // Generate the story using the API
      await generateStory.mutateAsync({
        childName: childDataToSave.childName,
        age: parseInt(childDataToSave.age),
        gender: childDataToSave.gender,
        language: childDataToSave.language,
        parentName: childDataToSave.parentName,
      });

      // Move to next step only after successful story generation
      nextStep();
    } catch (error) {
      console.error("Failed to generate story:", error);
      // Error handling is done in the hook
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Children's Personalized Storybook Generator
        </h2>
        <p className="text-gray-600">
          Create a magical personalized storybook for your child!{" "}
          <strong>Step 1:</strong> Fill in the details below to generate a
          custom story and analyze it for character design. You'll upload a
          photo in the next step.
        </p>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800">
            🧪 <strong>Enhanced with AI Story Analysis!</strong> Now featuring
            age-appropriate character designs and theme-based backgrounds.
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border"
      >
        <div>
          <Label htmlFor="childName">Child's Name *</Label>
          <Input
            id="childName"
            placeholder="Enter your child's name"
            value={formData.childName}
            onChange={(e) => handleInputChange("childName", e.target.value)}
            error={errors.childName}
          />
        </div>

        <div>
          <Label htmlFor="age">Age *</Label>
          <Select
            value={formData.age}
            onValueChange={(value) => handleInputChange("age", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              {ages.map((age) => (
                <SelectItem key={age} value={age.toString()}>
                  {age} years old
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.age && (
            <p className="text-sm text-red-600 mt-1">{errors.age}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boy">Boy</SelectItem>
              <SelectItem value="girl">Girl</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <Label htmlFor="language">Story Language *</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => handleInputChange("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.language && (
            <p className="text-sm text-red-600 mt-1">{errors.language}</p>
          )}
        </div>

        <div>
          <Label htmlFor="parentName">Parent's Name *</Label>
          <Input
            id="parentName"
            placeholder="Enter your name"
            value={formData.parentName}
            onChange={(e) => handleInputChange("parentName", e.target.value)}
            error={errors.parentName}
          />
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="min-w-[300px] h-14 text-lg"
            disabled={isLoading || generateStory.isPending}
          >
            {isLoading || generateStory.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Story...
              </>
            ) : (
              "📖 Next Step - Generate Story & Analyze"
            )}
          </Button>
        </div>
      </form>

      {/* What You'll Get Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
        <h3 className="text-blue-800 font-bold text-lg mb-4">
          🎉 What You'll Get:
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>📖 A personalized PDF storybook</li>
          <li>🎨 Custom caricature illustration of your child</li>
          <li>📚 AI-generated story featuring your child as the hero</li>
          <li>💝 Ready to print or share digitally</li>
        </ul>
      </div>
    </motion.div>
  );
}
