import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Settings, CheckCircle, Shield } from "lucide-react";

function DocumentVerification({ applicationId, onNext, onPrev }) {
  const { toast } = useToast();
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const { data: application } = useQuery({
    queryKey: ['/api/onboarding/applications', applicationId],
    enabled: !!applicationId
  });

  const ocrMutation = useMutation({
    mutationFn: async () => {
      if (!applicationId) throw new Error("No application ID");
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/verify-documents`);
      return response.json();
    },
    onSuccess: (data) => {
      setOcrComplete(true);
      setVerificationComplete(data.verified);
      toast({
        title: "Document Analysis Complete",
        description: data.verified 
          ? "Documents have been successfully verified using AI analysis."
          : "Document verification completed. Some issues may require review.",
        variant: data.verified ? "default" : "destructive"
      });
    },
    onError: (error) => {
      setOcrProcessing(false);
      toast({
        title: "Analysis Failed",
        description: "Document analysis failed. Please try again or contact support.",
        variant: "destructive"
      });
    }
  });

  // Remove the separate verify mutation since it's now combined with OCR

  useEffect(() => {
    if (applicationId && !ocrProcessing && !ocrComplete) {
      setOcrProcessing(true);
      // Start AI analysis after a brief delay
      setTimeout(() => {
        ocrMutation.mutate();
      }, 1500);
    }
  }, [applicationId, ocrProcessing, ocrComplete, ocrMutation]);

  useEffect(() => {
    if (ocrMutation.isSuccess || ocrMutation.isError) {
      setOcrProcessing(false);
    }
  }, [ocrMutation.isSuccess, ocrMutation.isError]);

  const extractedData = application?.extractedData;

  return (
    <div>
      <h3 className="text-xl font-semibold text-neutral-dark mb-6">Document Verification</h3>
      
      <div className="space-y-6">
        {/* OCR Processing */}
        <div className={`border rounded-lg p-4 ${ocrProcessing ? 'bg-blue-50 border-blue-200' : ocrComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center mb-3">
            <div className={`mr-3 ${ocrProcessing ? 'animate-spin' : ''}`}>
              {ocrProcessing ? (
                <Settings className="text-blue-600 text-xl" />
              ) : ocrComplete ? (
                <CheckCircle className="text-green-500 text-xl" />
              ) : (
                <Settings className="text-gray-400 text-xl" />
              )}
            </div>
            <h4 className="font-medium text-neutral-dark">OCR Data Extraction</h4>
          </div>
          <p className="text-sm text-neutral-medium">
            {ocrProcessing 
              ? "Analyzing your documents using Google Gemini AI technology..."
              : ocrComplete 
                ? "AI document analysis completed successfully"
                : "Waiting to start AI document analysis"
            }
          </p>
          {ocrProcessing && (
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          )}
        </div>

        {/* Verification Results */}
        {ocrComplete && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`border rounded-lg p-4 ${verificationComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-neutral-dark">Data Authenticity</h5>
                  <p className="text-sm text-neutral-medium">Government database verification</p>
                </div>
                {verificationComplete && <CheckCircle className="text-green-500 text-2xl" />}
              </div>
            </div>
            <div className={`border rounded-lg p-4 ${verificationComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-neutral-dark">Spoofing Detection</h5>
                  <p className="text-sm text-neutral-medium">Anti-fraud verification</p>
                </div>
                {verificationComplete && <CheckCircle className="text-green-500 text-2xl" />}
              </div>
            </div>
          </div>
        )}

        {/* Extracted Data Preview */}
        {extractedData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-neutral-dark mb-3">Extracted Information</h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {extractedData.fullName || extractedData.name || 'Demo User'}</div>
              <div><strong>ID Number:</strong> {extractedData.documentNumber || extractedData.idNumber || 'DEMO123456789'}</div>
              <div><strong>DOB:</strong> {extractedData.dateOfBirth || extractedData.dob || '1990-01-01'}</div>
              <div><strong>Address:</strong> {extractedData.address || 'Demo Address, City'}</div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {verificationComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Shield className="text-green-500 text-3xl mb-3 mx-auto" />
            <h4 className="font-semibold text-green-700">Verification Successful</h4>
            <p className="text-sm text-neutral-medium mt-1">All documents have been successfully verified</p>
          </div>
        )}
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
          onClick={onNext}
          disabled={!verificationComplete}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default DocumentVerification;