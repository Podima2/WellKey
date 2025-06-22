import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomCheckbox } from '../ui/CustomCheckbox';

interface FormData {
  selfHarm: string;
  selfHarmRecent: string;
  masturbation: string;
  masturbationFeelings: string;
  drugUse: string[];
  sexualPartners: string;
  sexualPartnersFeelings: string;
  abuseHistory: string;
  crimeHistory: string;
  crimeCaught: string;
}

interface SensitiveQuestionsSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onDrugUseChange: (drugUse: string[]) => void;
}

export const SensitiveQuestionsSection: React.FC<SensitiveQuestionsSectionProps> = ({ 
  formData, 
  onInputChange, 
  onDrugUseChange 
}) => {
  const drugOptions = [
    "None", 
    "Weed / Cannabis", 
    "MDMA / Ecstasy", 
    "Cocaine", 
    "LSD / Acid", 
    "Heroin", 
    "Meth", 
    "Fentanyl", 
    "Prescription drugs (not prescribed)", 
    "Something not listed", 
    "I've used a needle", 
    "Prefer not to answer"
  ];

  const handleDrugToggle = (drug: string) => {
    const currentDrugs = [...formData.drugUse];
    
    if (drug === "None") {
      if (currentDrugs.includes("None")) {
        // Deselect "None"
        onDrugUseChange([]);
      } else {
        // Select only "None" and clear all others
        onDrugUseChange(["None"]);
      }
      return;
    }

    // If any other drug is selected and "None" is currently selected
    if (currentDrugs.includes("None")) {
      // Remove "None" and add the new drug
      onDrugUseChange([drug]);
      return;
    }

    // Normal toggle behavior for other drugs
    if (currentDrugs.includes(drug)) {
      // Remove the drug
      onDrugUseChange(currentDrugs.filter(d => d !== drug));
    } else {
      // Add the drug
      onDrugUseChange([...currentDrugs, drug]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-red-900 to-orange-900 border border-red-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-300" />
        </div>
        <div>
          <h3 className="text-xl text-sharp text-white">Personal Wellness Assessment</h3>
          <p className="text-neutral-400 text-sm font-medium italic">
            You are anonymous. These questions may help someone else feel less alone.
          </p>
        </div>
      </div>

      {/* Self-Harm */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          Have you ever seriously planned or attempted to harm yourself?
        </label>
        <CustomSelect
          value={formData.selfHarm}
          onChange={(value) => onInputChange('selfHarm', value)}
          options={[
            { value: "", label: "Select option" },
            { value: "never", label: "Never" },
            { value: "thought-about-it", label: "Thought about it" },
            { value: "made-plan", label: "Made a plan" },
            { value: "attempted", label: "Attempted it" },
            { value: "prefer-not", label: "Prefer not to answer" }
          ]}
          placeholder="Select option"
        />
        {formData.selfHarm && formData.selfHarm !== "never" && formData.selfHarm !== "prefer-not" && (
          <div className="animate-scale-in">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 tracking-wide">
              When was the most recent occurrence?
            </label>
            <input
              type="text"
              value={formData.selfHarmRecent}
              onChange={(e) => onInputChange('selfHarmRecent', e.target.value)}
              placeholder="e.g., Last month, 6 months ago..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 font-medium hover:bg-neutral-800 hover:border-neutral-700 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Masturbation */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          How often do you masturbate, honestly?
        </label>
        <CustomSelect
          value={formData.masturbation}
          onChange={(value) => onInputChange('masturbation', value)}
          options={[
            { value: "", label: "Select frequency" },
            { value: "i-dont", label: "I don't" },
            { value: "once-month", label: "Once a month or less" },
            { value: "1-3-week", label: "1–3 times a week" },
            { value: "daily", label: "Daily" },
            { value: "multiple-day", label: "Multiple times a day" },
            { value: "lost-control", label: "I've lost control over it" }
          ]}
          placeholder="Select frequency"
        />
        {formData.masturbation && formData.masturbation !== "i-dont" && (
          <div className="animate-scale-in">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 tracking-wide">
              How do you feel about your habits?
            </label>
            <CustomSelect
              value={formData.masturbationFeelings}
              onChange={(value) => onInputChange('masturbationFeelings', value)}
              options={[
                { value: "", label: "Select feeling" },
                { value: "guilty", label: "Guilty" },
                { value: "indifferent", label: "Indifferent" },
                { value: "empowered", label: "Empowered" }
              ]}
              placeholder="Select feeling"
            />
          </div>
        )}
      </div>

      {/* Drug Use */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          What drugs have you willingly taken? (Select all that apply)
        </label>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {drugOptions.map(drug => (
              <CustomCheckbox
                key={drug}
                checked={formData.drugUse.includes(drug)}
                onChange={() => handleDrugToggle(drug)}
                label={drug}
              />
            ))}
          </div>
          
          {/* Selection Summary */}
          {formData.drugUse.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="text-sm text-neutral-400 font-medium">
                <span className="text-neutral-300">Selected:</span> {formData.drugUse.length} option{formData.drugUse.length !== 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.drugUse.slice(0, 3).map(drug => (
                  <span key={drug} className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 font-medium">
                    {drug}
                  </span>
                ))}
                {formData.drugUse.length > 3 && (
                  <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 font-medium">
                    +{formData.drugUse.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sexual History */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          Roughly how many sexual partners have you had in your life?
        </label>
        <CustomSelect
          value={formData.sexualPartners}
          onChange={(value) => onInputChange('sexualPartners', value)}
          options={[
            { value: "", label: "Select option" },
            { value: "0", label: "0" },
            { value: "1-5", label: "1–5" },
            { value: "6-15", label: "6–15" },
            { value: "16-50", label: "16–50" },
            { value: "51+", label: "51+" },
            { value: "lost-count", label: "I've lost count" }
          ]}
          placeholder="Select option"
        />
        {formData.sexualPartners && formData.sexualPartners !== "0" && (
          <div className="animate-scale-in">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 tracking-wide">
              Do you feel proud, ashamed, or indifferent about this?
            </label>
            <CustomSelect
              value={formData.sexualPartnersFeelings}
              onChange={(value) => onInputChange('sexualPartnersFeelings', value)}
              options={[
                { value: "", label: "Select feeling" },
                { value: "proud", label: "Proud" },
                { value: "ashamed", label: "Ashamed" },
                { value: "indifferent", label: "Indifferent" }
              ]}
              placeholder="Select feeling"
            />
          </div>
        )}
      </div>

      {/* Abuse History */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          Have you experienced any form of abuse?
        </label>
        <CustomSelect
          value={formData.abuseHistory}
          onChange={(value) => onInputChange('abuseHistory', value)}
          options={[
            { value: "", label: "Select option" },
            { value: "physical-abuse", label: "Physical abuse" },
            { value: "sexual-abuse", label: "Sexual abuse" },
            { value: "emotional-psychological", label: "Emotional or psychological abuse" },
            { value: "neglect", label: "Neglect" },
            { value: "multiple-types", label: "Multiple types of abuse" },
            { value: "no-none", label: "No, none of these" },
            { value: "not-sure", label: "I'm not sure" },
            { value: "prefer-not", label: "Prefer not to answer" }
          ]}
          placeholder="Select option"
        />
      </div>

      {/* Crime History */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-300 tracking-wide">
          Have you ever broken the law in a serious way?
        </label>
        <CustomSelect
          value={formData.crimeHistory}
          onChange={(value) => onInputChange('crimeHistory', value)}
          options={[
            { value: "", label: "Select option" },
            { value: "no", label: "No" },
            { value: "minor-offenses", label: "Minor offenses (e.g., shoplifting, trespassing)" },
            { value: "drug-related", label: "Drug-related crime" },
            { value: "assault-violent", label: "Assault or violent crime" },
            { value: "fraud-theft-cyber", label: "Fraud, theft, or cybercrime" },
            { value: "been-arrested", label: "I've been arrested" },
            { value: "been-prison", label: "I've been in prison" },
            { value: "prefer-not", label: "Prefer not to answer" }
          ]}
          placeholder="Select option"
        />
        {formData.crimeHistory && formData.crimeHistory !== "no" && formData.crimeHistory !== "prefer-not" && (
          <div className="animate-scale-in">
            <label className="block text-sm font-semibold text-neutral-400 mb-2 tracking-wide">
              Were you caught?
            </label>
            <CustomSelect
              value={formData.crimeCaught}
              onChange={(value) => onInputChange('crimeCaught', value)}
              options={[
                { value: "", label: "Select option" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "prefer-not", label: "Prefer not to answer" }
              ]}
              placeholder="Select option"
            />
          </div>
        )}
      </div>
    </div>
  );
};