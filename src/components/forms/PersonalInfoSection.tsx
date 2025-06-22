import React from 'react';
import { User } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

interface FormData {
  age: string;
}

interface PersonalInfoSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  onInputChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl">
          <User className="w-5 h-5 text-neutral-300" />
        </div>
        <div>
          <h3 className="text-xl text-sharp text-white">Personal Information</h3>
          <p className="text-neutral-400 text-sm font-medium">Basic demographic information</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide">
          Age Range
        </label>
        <CustomSelect
          value={formData.age}
          onChange={(value) => onInputChange('age', value)}
          options={[
            { value: "", label: "Select age range" },
            { value: "18-25", label: "18-25" },
            { value: "26-35", label: "26-35" },
            { value: "36-45", label: "36-45" },
            { value: "46-55", label: "46-55" },
            { value: "56-65", label: "56-65" },
            { value: "65+", label: "65+" }
          ]}
          placeholder="Select age range"
          required
        />
      </div>
    </div>
  );
};