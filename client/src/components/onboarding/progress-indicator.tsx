interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progressPercent = (currentStep / totalSteps) * 100;
  const steps = ["Start", "Details", "Documents", "Verification", "Consent", "Approval", "Complete"];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neutral-dark">Customer Onboarding</h2>
        <div className="text-sm text-neutral-medium">Step {currentStep} of {totalSteps}</div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-neutral-medium">
        {steps.map((step, index) => (
          <span 
            key={step} 
            className={index + 1 === currentStep ? "font-medium text-blue-600" : ""}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
