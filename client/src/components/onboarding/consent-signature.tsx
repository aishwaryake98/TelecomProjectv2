import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, RotateCcw, PenTool } from "lucide-react";

interface ConsentSignatureProps {
  applicationId: string | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function ConsentSignature({ applicationId, onNext, onPrev }: ConsentSignatureProps) {
  const { toast } = useToast();
  const [consents, setConsents] = useState([false, false, false]);
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [hasSignature, setHasSignature] = useState(false);

  const consentMutation = useMutation({
    mutationFn: async (data: { consents: boolean[], otp: string, digitalSignature: string }) => {
      if (!applicationId) throw new Error("No application ID");
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/consent`, data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.otpValid) {
        toast({
          title: "Consent Submitted",
          description: "Your consent and verification have been recorded successfully."
        });
        onNext();
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP and try again.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit consent. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleConsentChange = (index: number, checked: boolean) => {
    const newConsents = [...consents];
    newConsents[index] = checked;
    setConsents(newConsents);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpInputs];
      newOtp[index] = value;
      setOtpInputs(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    const otp = otpInputs.join('');
    
    if (!consents.every(c => c)) {
      toast({
        title: "Consent Required",
        description: "Please accept all terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "OTP Required",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive"
      });
      return;
    }

    if (!hasSignature) {
      toast({
        title: "Digital Signature Required",
        description: "Please provide your digital signature to proceed.",
        variant: "destructive"
      });
      return;
    }

    consentMutation.mutate({
      consents,
      otp,
      digitalSignature: "digital_signature_hash"
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-neutral-dark mb-6">Digital Consent & E-Signature</h3>
      
      <div className="space-y-6">
        {/* Terms and Conditions */}
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <h5 className="font-medium text-neutral-dark mb-2">Terms and Conditions</h5>
          <p className="text-sm text-neutral-medium">
            By proceeding with this onboarding process, you agree to our terms of service, privacy policy, and consent to the processing of your personal data for KYC verification purposes. Your information will be securely stored and used only for account setup and regulatory compliance...
          </p>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent-1"
              checked={consents[0]}
              onCheckedChange={(checked) => handleConsentChange(0, !!checked)}
            />
            <label htmlFor="consent-1" className="text-sm text-neutral-dark cursor-pointer">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent-2"
              checked={consents[1]}
              onCheckedChange={(checked) => handleConsentChange(1, !!checked)}
            />
            <label htmlFor="consent-2" className="text-sm text-neutral-dark cursor-pointer">
              I consent to the processing of my personal data for KYC verification
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent-3"
              checked={consents[2]}
              onCheckedChange={(checked) => handleConsentChange(2, !!checked)}
            />
            <label htmlFor="consent-3" className="text-sm text-neutral-dark cursor-pointer">
              I authorize TeleConnect to contact me regarding my application
            </label>
          </div>
        </div>

        {/* OTP Verification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-neutral-dark mb-3">OTP Verification</h5>
          <p className="text-sm text-neutral-medium mb-4">Enter the 6-digit OTP sent to your mobile number +91 98765-43210</p>
          <div className="flex space-x-2 mb-4">
            {otpInputs.map((value, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-medium"
              />
            ))}
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            <RotateCcw className="mr-1 h-3 w-3" />
            Resend OTP
          </button>
        </div>

        {/* Digital Signature Area */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h5 className="font-medium text-neutral-dark mb-3">Digital Signature</h5>
          <div 
            className={`border border-gray-200 rounded-lg h-32 flex items-center justify-center cursor-pointer transition-colors ${hasSignature ? 'bg-green-50 border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
            onClick={() => setHasSignature(true)}
          >
            <div className="text-center text-neutral-medium">
              {hasSignature ? (
                <>
                  <PenTool className="text-green-500 text-2xl mb-2 mx-auto" />
                  <p className="text-sm text-green-600">Digital signature captured</p>
                </>
              ) : (
                <>
                  <PenTool className="text-2xl mb-2 mx-auto" />
                  <p className="text-sm">Click here to sign digitally</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          onClick={onPrev} 
          variant="outline"
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={consentMutation.isPending}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {consentMutation.isPending ? "Submitting..." : "Submit Application"} 
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
