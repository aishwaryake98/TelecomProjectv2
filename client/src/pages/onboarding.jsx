import { useState } from "react";
import { Signal, Headset } from "lucide-react";
import ProgressIndicator from "@/components/onboarding/progress-indicator.jsx";
import CustomerDetailsForm from "@/components/onboarding/customer-details-form.jsx";
import DocumentUpload from "@/components/onboarding/document-upload.jsx";
import DocumentVerification from "@/components/onboarding/document-verification.jsx";
import ConsentSignature from "@/components/onboarding/consent-signature.jsx";
import KYCApproval from "@/components/onboarding/kyc-approval.jsx";
import WelcomeCompletion from "@/components/onboarding/welcome-completion.jsx";

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);
  const totalSteps = 7;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Signal className="text-telecom-blue text-2xl" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-dark mb-2">Welcome to TeleConnect</h3>
            <p className="text-neutral-medium mb-8">Let's get you connected with our premium telecom services. The entire process takes just a few minutes.</p>



            <button 
              onClick={nextStep} 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Onboarding →
            </button>
          </div>
        );
      case 2:
        return <CustomerDetailsForm onNext={nextStep} onPrev={prevStep} onApplicationCreate={setApplicationId} />;
      case 3:
        return <DocumentUpload applicationId={applicationId} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <DocumentVerification applicationId={applicationId} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <ConsentSignature applicationId={applicationId} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <KYCApproval applicationId={applicationId} onNext={nextStep} onPrev={prevStep} />;
      case 7:
        return <WelcomeCompletion applicationId={applicationId} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Signal className="text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-dark">TeleConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-medium">Need help?</span>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Headset className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStepContent()}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-neutral-dark">Need Assistance?</h4>
              <p className="text-sm text-neutral-medium">Our support team is here to help 24/7</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Signal />
              </button>
              <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors">
                <Headset />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h5 className="font-semibold mb-3">TeleConnect</h5>
              <p className="text-sm text-gray-400">Connecting you to the future of telecommunications.</p>
            </div>
            <div>
              <h6 className="font-medium mb-3">Support</h6>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Live Chat</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium mb-3">Legal</h6>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Protection</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium mb-3">Connect</h6>
              <div className="flex space-x-3">
                <div className="text-gray-400 hover:text-white cursor-pointer">Twitter</div>
                <div className="text-gray-400 hover:text-white cursor-pointer">Facebook</div>
                <div className="text-gray-400 hover:text-white cursor-pointer">LinkedIn</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            © 2024 TeleConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default OnboardingPage;