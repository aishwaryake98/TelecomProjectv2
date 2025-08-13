import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Smartphone, Download, BarChart3, MessageSquare, Mail, Bell } from "lucide-react";

interface WelcomeCompletionProps {
  applicationId: string | null;
}

export default function WelcomeCompletion({ applicationId }: WelcomeCompletionProps) {
  const { toast } = useToast();

  const { data: application } = useQuery({
    queryKey: ['/api/onboarding/applications', applicationId],
    enabled: !!applicationId
  });

  const notificationMutation = useMutation({
    mutationFn: async (types: string[]) => {
      if (!applicationId) throw new Error("No application ID");
      const response = await apiRequest("POST", `/api/onboarding/applications/${applicationId}/notifications`, {
        types
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome Notifications Sent",
        description: "You'll receive confirmation messages across all channels."
      });
    }
  });

  useEffect(() => {
    if (applicationId) {
      // Send welcome notifications
      notificationMutation.mutate(['sms', 'email', 'push']);
    }
  }, [applicationId, notificationMutation]);

  return (
    <div className="text-center">
      <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-white text-3xl" />
      </div>
      
      <h3 className="text-2xl font-bold text-neutral-dark mb-4">Welcome to TeleConnect!</h3>
      <p className="text-neutral-medium mb-8">Your account has been successfully created and your service is now active.</p>
      
      {/* Account Details */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
        <h4 className="font-semibold text-neutral-dark mb-4">Your Account Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-medium">Account Number:</span>
            <span className="font-medium text-neutral-dark">{application?.accountNumber || "TC-987654321"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-medium">Plan:</span>
            <span className="font-medium text-neutral-dark">{application?.planType || "Premium Unlimited"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-medium">Activation Date:</span>
            <span className="font-medium text-neutral-dark">Today</span>
          </div>
        </div>
      </div>

      {/* Notification Status */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <MessageSquare className="text-green-500 text-xl mb-2 mx-auto" />
          <h5 className="font-medium text-neutral-dark">SMS Sent</h5>
          <p className="text-xs text-neutral-medium">Welcome message sent to +91 98765-43210</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Mail className="text-green-500 text-xl mb-2 mx-auto" />
          <h5 className="font-medium text-neutral-dark">Email Sent</h5>
          <p className="text-xs text-neutral-medium">Welcome email sent to your inbox</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Bell className="text-green-500 text-xl mb-2 mx-auto" />
          <h5 className="font-medium text-neutral-dark">App Notification</h5>
          <p className="text-xs text-neutral-medium">Push notification sent to your device</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <BarChart3 className="mr-2 h-4 w-4" /> Go to Dashboard
        </Button>
        <Button className="bg-orange-500 text-white hover:bg-orange-600">
          <Download className="mr-2 h-4 w-4" /> Download App
        </Button>
      </div>

      {/* Next Steps */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-neutral-dark mb-4">What's Next?</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-left">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Smartphone className="text-blue-600 h-4 w-4" />
            </div>
            <div>
              <h5 className="font-medium text-neutral-dark">Download Our App</h5>
              <p className="text-neutral-medium">Get the TeleConnect mobile app for easy account management</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <BarChart3 className="text-orange-500 h-4 w-4" />
            </div>
            <div>
              <h5 className="font-medium text-neutral-dark">Explore Dashboard</h5>
              <p className="text-neutral-medium">Manage your account, view usage, and update preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
