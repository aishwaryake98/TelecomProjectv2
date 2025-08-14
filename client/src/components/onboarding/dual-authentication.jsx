import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Shield, RefreshCw, CheckCircle2, Clock } from "lucide-react";

function DualAuthentication({ applicationId, onNext, onPrev }) {
  const { toast } = useToast();
  const [emailOTP, setEmailOTP] = useState("");
  const [smsOTP, setSmsOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [smsTimer, setSmsTimer] = useState(0);

  const { data: application } = useQuery({
    queryKey: ['/api/onboarding/applications', applicationId],
    enabled: !!applicationId
  });

  // Send Email OTP
  const sendEmailOTPMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/send-otp`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email OTP Sent",
        description: `OTP has been sent to ${application?.email || 'your email'}`
      });
      setEmailTimer(60);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send email OTP. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send SMS OTP
  const sendSMSOTPMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/send-sms-otp`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "SMS OTP Sent",
        description: `OTP has been sent to ${application?.phone || 'your phone'}`
      });
      setSmsTimer(60);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to send SMS OTP. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Verify Email OTP
  const verifyEmailOTPMutation = useMutation({
    mutationFn: async (otp) => {
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/consent`, {
        otp,
        consents: [true, true, true, true],
        digitalSignature: "verified_signature"
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.otpValid) {
        setEmailVerified(true);
        toast({
          title: "Email Verified",
          description: "Email OTP verified successfully!"
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your email OTP and try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Verify SMS OTP
  const verifySMSOTPMutation = useMutation({
    mutationFn: async (otp) => {
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/verify-sms-otp`, {
        otp
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        setSmsVerified(true);
        toast({
          title: "Phone Verified",
          description: "SMS OTP verified successfully!"
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: data.message || "Please check your SMS OTP and try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (emailTimer > 0) setEmailTimer(emailTimer - 1);
      if (smsTimer > 0) setSmsTimer(smsTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [emailTimer, smsTimer]);

  // Auto-send OTPs on component mount if not already verified
  useEffect(() => {
    if (applicationId && application && !emailVerified && !smsVerified) {
      sendEmailOTPMutation.mutate();
      sendSMSOTPMutation.mutate();
    }
  }, [applicationId, application]);

  // Check if OTPs are already verified from the application data
  useEffect(() => {
    if (application) {
      setEmailVerified(application.otpVerified || false);
      setSmsVerified(application.smsOtpVerified || false);
    }
  }, [application]);

  const handleEmailVerification = () => {
    if (emailOTP.length === 6) {
      verifyEmailOTPMutation.mutate(emailOTP);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive"
      });
    }
  };

  const handleSMSVerification = () => {
    if (smsOTP.length === 6) {
      verifySMSOTPMutation.mutate(smsOTP);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (emailVerified && smsVerified) {
      onNext();
    } else {
      toast({
        title: "Verification Required",
        description: "Please verify both email and phone number to continue.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-blue-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-dark mb-2">Two-Factor Authentication</h3>
        <p className="text-neutral-medium">We've sent verification codes to secure your account</p>
      </div>

      {/* Email Verification */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Mail className="text-blue-600 mr-2" />
            <div>
              <h4 className="font-medium text-neutral-dark">Email Verification</h4>
              <p className="text-sm text-neutral-medium">{application?.email}</p>
            </div>
          </div>
          {emailVerified && <CheckCircle2 className="text-green-500" />}
        </div>

        <div className="flex space-x-2 mb-3">
          <Input
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="text-center text-lg font-mono tracking-wider"
            disabled={emailVerified}
          />
          <Button 
            onClick={handleEmailVerification}
            disabled={emailOTP.length !== 6 || emailVerified || verifyEmailOTPMutation.isPending}
            className="px-6"
          >
            {verifyEmailOTPMutation.isPending ? "Verifying..." : "Verify"}
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-medium">
            {emailTimer > 0 ? (
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />Resend in {emailTimer}s</span>
            ) : (
              "Didn't receive code?"
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendEmailOTPMutation.mutate()}
            disabled={emailTimer > 0 || sendEmailOTPMutation.isPending}
            className="text-blue-600"
          >
            {sendEmailOTPMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Resend"}
          </Button>
        </div>
      </div>

      {/* SMS Verification */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Phone className="text-green-600 mr-2" />
            <div>
              <h4 className="font-medium text-neutral-dark">Phone Verification</h4>
              <p className="text-sm text-neutral-medium">{application?.phone}</p>
            </div>
          </div>
          {smsVerified && <CheckCircle2 className="text-green-500" />}
        </div>

        <div className="flex space-x-2 mb-3">
          <Input
            value={smsOTP}
            onChange={(e) => setSmsOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="text-center text-lg font-mono tracking-wider"
            disabled={smsVerified}
          />
          <Button 
            onClick={handleSMSVerification}
            disabled={smsOTP.length !== 6 || smsVerified || verifySMSOTPMutation.isPending}
            className="px-6"
          >
            {verifySMSOTPMutation.isPending ? "Verifying..." : "Verify"}
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-medium">
            {smsTimer > 0 ? (
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />Resend in {smsTimer}s</span>
            ) : (
              "Didn't receive code?"
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendSMSOTPMutation.mutate()}
            disabled={smsTimer > 0 || sendSMSOTPMutation.isPending}
            className="text-green-600"
          >
            {sendSMSOTPMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Resend"}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-dark font-medium">Verification Progress</span>
          <span className="text-blue-600">{(emailVerified ? 1 : 0) + (smsVerified ? 1 : 0)}/2 completed</span>
        </div>
        <div className="bg-blue-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((emailVerified ? 1 : 0) + (smsVerified ? 1 : 0)) * 50}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!emailVerified || !smsVerified}
          className={`px-6 ${emailVerified && smsVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {emailVerified && smsVerified ? "Continue to KYC" : "Complete Verification"}
        </Button>
      </div>
    </div>
  );
}

export default DualAuthentication;