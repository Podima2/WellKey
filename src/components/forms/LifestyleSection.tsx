import React from 'react';
import { Activity } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

interface FormData {
  currentMood: string;
  sleepQuality: string;
  stressLevel: string;
  exerciseFrequency: string;
  dietPreference: string;
}

interface LifestyleSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({ 
  formData, 
  onInputChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-900 to-indigo-900 border border-blue-800 rounded-xl">
          <Activity className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <h3 className="text-xl text-sharp text-white">Lifestyle & Wellness</h3>
          <p className="text-neutral-400 text-sm font-medium">Current state and habits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
            Current Mood
          </label>
          <CustomSelect
            value={formData.currentMood}
            onChange={(value) => onInputChange('currentMood', value)}
            options={[
              { value: "", label: "Select mood" },
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "neutral", label: "Neutral" },
              { value: "poor", label: "Poor" },
              { value: "terrible", label: "Terrible" }
            ]}
            placeholder="Select mood"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
            Sleep Quality
          </label>
          <CustomSelect
            value={formData.sleepQuality}
            onChange={(value) => onInputChange('sleepQuality', value)}
            options={[
              { value: "", label: "Select quality" },
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "fair", label: "Fair" },
              { value: "poor", label: "Poor" },
              { value: "terrible", label: "Terrible" }
            ]}
            placeholder="Select quality"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
            Stress Level
          </label>
          <CustomSelect
            value={formData.stressLevel}
            onChange={(value) => onInputChange('stressLevel', value)}
            options={[
              { value: "", label: "Select level" },
              { value: "very-low", label: "Very Low" },
              { value: "low", label: "Low" },
              { value: "moderate", label: "Moderate" },
              { value: "high", label: "High" },
              { value: "very-high", label: "Very High" }
            ]}
            placeholder="Select level"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
            Exercise Frequency
          </label>
          <CustomSelect
            value={formData.exerciseFrequency}
            onChange={(value) => onInputChange('exerciseFrequency', value)}
            options={[
              { value: "", label: "Select frequency" },
              { value: "daily", label: "Daily" },
              { value: "several-times-week", label: "Several times a week" },
              { value: "once-week", label: "Once a week" },
              { value: "rarely", label: "Rarely" },
              { value: "never", label: "Never" }
            ]}
            placeholder="Select frequency"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
          Diet Preference
        </label>
        <CustomSelect
          value={formData.dietPreference}
          onChange={(value) => onInputChange('dietPreference', value)}
          options={[
            { value: "", label: "Select preference" },
            { value: "omnivore", label: "Omnivore" },
            { value: "vegetarian", label: "Vegetarian" },
            { value: "vegan", label: "Vegan" },
            { value: "pescatarian", label: "Pescatarian" },
            { value: "keto", label: "Keto" },
            { value: "paleo", label: "Paleo" },
            { value: "other", label: "Other" }
          ]}
          placeholder="Select preference"
          required
        />
      </div>
    </div>
  );
};