import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Settings, CheckCircle, Shield } from "lucide-react";

interface DocumentVerificationProps {
  applicationId: string | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function DocumentVerification({ applicationId, onNext, onPrev }: DocumentVerificationProps) {
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
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/ocr`, {
        documentType: 'aadhaar'
      });
      return response.json();
    },
    onSuccess: () => {
      setOcrComplete(true);
      toast({
        title: "OCR Complete",
        description: "Document data has been extracted successfully."
      });
      // Start verification after OCR
      verifyMutation.mutate();
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!applicationId) throw new Error("No application ID");
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/verify`);
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationComplete(data.verified);
      toast({
        title: data.verified ? "Verification Successful" : "Verification Failed",
        description: data.verified 
          ? "All documents have been successfully verified" 
          : "Document verification failed. Please check your documents.",
        variant: data.verified ? "default" : "destructive"
      });
    }
  });

  useEffect(() => {
    if (applicationId && !ocrProcessing && !ocrComplete) {
      setOcrProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        ocrMutation.mutate();
        setOcrProcessing(false);
      }, 2000);
    }
  }, [applicationId, ocrProcessing, ocrComplete, ocrMutation]);

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
              ? "Extracting data from your documents using advanced AI technology..."
              : ocrComplete 
                ? "Data extraction completed successfully"
                : "Waiting to start data extraction"
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
              <div><strong>Name:</strong> {extractedData.name}</div>
              <div><strong>ID Number:</strong> {extractedData.idNumber}</div>
              <div><strong>DOB:</strong> {extractedData.dob}</div>
              <div><strong>Address:</strong> {extractedData.address}</div>
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
