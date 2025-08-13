import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Settings, CheckCircle, Circle, ThumbsUp } from "lucide-react";

interface KYCApprovalProps {
  applicationId: string | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function KYCApproval({ applicationId, onNext, onPrev }: KYCApprovalProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const [approved, setApproved] = useState(false);

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!applicationId) throw new Error("No application ID");
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/approve`);
      return response.json();
    },
    onSuccess: (data) => {
      setApproved(data.approved);
      setProcessing(false);
      if (data.approved) {
        toast({
          title: "KYC Approved!",
          description: "Your application has been approved successfully."
        });
        setTimeout(() => {
          onNext();
        }, 2000);
      } else {
        toast({
          title: "Approval Pending",
          description: "Your application is still under review.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      setProcessing(false);
      toast({
        title: "Processing Error",
        description: "Failed to process your application. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (applicationId && processing) {
      // Simulate processing time
      setTimeout(() => {
        approveMutation.mutate();
      }, 3000);
    }
  }, [applicationId, processing, approveMutation]);

  const handleApproval = () => {
    if (!approved) {
      approveMutation.mutate();
    } else {
      onNext();
    }
  };

  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${approved ? 'bg-green-100' : 'bg-yellow-50'}`}>
        {processing ? (
          <div className="animate-spin">
            <Settings className={`${approved ? 'text-green-500' : 'text-orange-500'} text-2xl`} />
          </div>
        ) : approved ? (
          <CheckCircle className="text-green-500 text-2xl" />
        ) : (
          <Settings className="text-orange-500 text-2xl" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-dark mb-4">
        {processing ? "Processing Your Application" : approved ? "Application Approved!" : "Processing Complete"}
      </h3>
      
      <p className="text-neutral-medium mb-6">
        {processing 
          ? "Please wait while we review your KYC documents and application..."
          : approved 
            ? "Your KYC verification has been completed successfully."
            : "Your application has been processed."
        }
      </p>
      
      {processing && (
        <div className="bg-gray-100 rounded-full h-2 mb-6 max-w-md mx-auto">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}

      {/* Processing Steps */}
      <div className="space-y-4 max-w-md mx-auto text-left mb-8">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-3" />
          <span className="text-sm text-neutral-dark">Document verification completed</span>
        </div>
        <div className="flex items-center">
          {processing ? (
            <div className="animate-spin mr-3">
              <Settings className="text-blue-600" />
            </div>
          ) : approved ? (
            <CheckCircle className="text-green-500 mr-3" />
          ) : (
            <Circle className="text-neutral-medium mr-3" />
          )}
          <span className="text-sm text-neutral-dark">
            {approved ? "Final approval completed" : "Final approval in progress..."}
          </span>
        </div>
        <div className="flex items-center">
          {approved ? (
            <CheckCircle className="text-green-500 mr-3" />
          ) : (
            <Circle className="text-neutral-medium mr-3" />
          )}
          <span className={`text-sm ${approved ? 'text-neutral-dark' : 'text-neutral-medium opacity-50'}`}>
            {approved ? "Service activation ready" : "Service activation pending"}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        {approved ? (
          <Button 
            onClick={handleApproval}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-medium"
          >
            <ThumbsUp className="mr-2 h-4 w-4" /> Continue to Welcome
          </Button>
        ) : !processing ? (
          <div className="flex space-x-4">
            <Button 
              onClick={onPrev}
              variant="outline"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Go Back
            </Button>
            <Button 
              onClick={handleApproval}
              disabled={approveMutation.isPending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {approveMutation.isPending ? "Processing..." : "Retry Approval"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
