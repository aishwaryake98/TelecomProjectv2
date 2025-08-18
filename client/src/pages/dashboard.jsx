import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  BarChart3, 
  Phone, 
  Mail, 
  Settings, 
  User, 
  CreditCard, 
  History,
  Download,
  Shield,
  TrendingUp,
  Home,
  Edit,
  Save,
  ArrowLeft
} from "lucide-react";

function Dashboard() {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  // Get user data from the most recent application
  const { data: applications } = useQuery({
    queryKey: ['/api/onboarding/applications'],
    select: (data) => Array.isArray(data) ? data : []
  });

  // Get the most recent user application
  const userApplication = applications?.[applications.length - 1];
  
  const userData = userApplication ? {
    name: `${userApplication.firstName} ${userApplication.lastName}`,
    email: userApplication.email,
    phone: userApplication.phone,
    accountNumber: userApplication.accountNumber || "TC-" + userApplication.id.slice(-8).toUpperCase(),
    plan: userApplication.planType || "Premium Unlimited",
    status: userApplication.serviceActivated ? "Active" : "Pending",
    activationDate: userApplication.serviceActivated ? "Today" : "Pending",
    usage: {
      data: { used: 45.2, total: 100, unit: "GB" },
      calls: { used: 120, total: 500, unit: "minutes" },
      sms: { used: 85, total: 200, unit: "messages" }
    },
    billing: {
      currentBill: 899,
      dueDate: "25th Aug 2025",
      status: "paid"
    }
  } : {
    name: "User",
    email: "user@example.com",
    phone: "+91 00000 00000",
    accountNumber: "TC-XXXXXXXX",
    plan: "Premium Unlimited",
    status: "Pending",
    activationDate: "Pending",
    usage: {
      data: { used: 0, total: 100, unit: "GB" },
      calls: { used: 0, total: 500, unit: "minutes" },
      sms: { used: 0, total: 200, unit: "messages" }
    },
    billing: {
      currentBill: 0,
      dueDate: "Not available",
      status: "pending"
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      if (userApplication?.id) {
        const response = await apiRequest("PATCH", `/api/onboarding/applications/${userApplication.id}`, profileData);
        return response.json();
      }
      throw new Error("No application ID found");
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      setIsEditingProfile(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate and download bill
  const downloadBillMutation = useMutation({
    mutationFn: async () => {
      // Simulate PDF generation and download
      const billData = {
        customerName: userData.name,
        accountNumber: userData.accountNumber,
        billingPeriod: "August 2025",
        amount: userData.billing.currentBill,
        dueDate: userData.billing.dueDate,
        usage: userData.usage
      };
      return billData;
    },
    onSuccess: (billData) => {
      // Generate and download a simple text file as demo
      const content = `
TELECONNECT BILL

Customer: ${billData.customerName}
Account: ${billData.accountNumber}
Billing Period: ${billData.billingPeriod}
Amount Due: ₹${billData.amount}
Due Date: ${billData.dueDate}

Usage Summary:
- Data: ${userData.usage.data.used} GB of ${userData.usage.data.total} GB
- Voice: ${userData.usage.calls.used} of ${userData.usage.calls.total} minutes
- SMS: ${userData.usage.sms.used} of ${userData.usage.sms.total} messages

Thank you for choosing TeleConnect!
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TeleConnect_Bill_${billData.accountNumber}_${billData.billingPeriod.replace(' ', '_')}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Bill Downloaded",
        description: "Your bill has been downloaded successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download bill. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-4">
                <Link href="/" data-testid="link-home">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData.name}</h1>
                  <p className="text-gray-600">Account: {userData.accountNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="outline" 
                className={userData.status === 'Active' 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }
              >
                {userData.status}
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Account Settings</DialogTitle>
                    <DialogDescription>
                      Update your account preferences and profile information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Profile Information</h4>
                      <Button
                        onClick={() => {
                          setIsEditingProfile(true);
                          setEditedProfile({
                            firstName: userData.name.split(' ')[0],
                            lastName: userData.name.split(' ').slice(1).join(' '),
                            email: userData.email,
                            phone: userData.phone
                          });
                        }}
                        variant="outline"
                        className="w-full"
                        data-testid="button-edit-profile"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.usage.data.used} GB</div>
                  <p className="text-xs text-muted-foreground">
                    of {userData.usage.data.total} GB used
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(userData.usage.data.used / userData.usage.data.total) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Voice Minutes</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.usage.calls.used}</div>
                  <p className="text-xs text-muted-foreground">
                    of {userData.usage.calls.total} minutes used
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(userData.usage.calls.used / userData.usage.calls.total) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{userData.billing.currentBill}</div>
                  <p className="text-xs text-muted-foreground">
                    Due {userData.billing.dueDate}
                  </p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                    Paid
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account Activated</p>
                      <p className="text-xs text-gray-500">Your TeleConnect account is now active and ready to use</p>
                    </div>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome Email Sent</p>
                      <p className="text-xs text-gray-500">Account details and welcome information delivered</p>
                    </div>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">KYC Verification Complete</p>
                      <p className="text-xs text-gray-500">Identity verification successful</p>
                    </div>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Usage Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Used this month</span>
                      <span className="font-semibold">{userData.usage.data.used} GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${(userData.usage.data.used / userData.usage.data.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {userData.usage.data.total - userData.usage.data.used} GB remaining
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voice & SMS Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Voice Minutes</span>
                        <span className="font-semibold">{userData.usage.calls.used}/{userData.usage.calls.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(userData.usage.calls.used / userData.usage.calls.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>SMS Messages</span>
                        <span className="font-semibold">{userData.usage.sms.used}/{userData.usage.sms.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(userData.usage.sms.used / userData.usage.sms.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Bill</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Plan ({userData.plan})</span>
                      <span className="font-semibold">₹899</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxes & Fees</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span>₹{userData.billing.currentBill}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Due Date: {userData.billing.dueDate}
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => downloadBillMutation.mutate()}
                      disabled={downloadBillMutation.isPending}
                      data-testid="button-download-bill"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {downloadBillMutation.isPending ? "Generating..." : "Download Bill"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Current Month</p>
                        <p className="text-sm text-gray-600">Aug 2025</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Payment history will be available after your first billing cycle.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900" data-testid="text-user-name">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900" data-testid="text-user-email">{userData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900" data-testid="text-user-phone">{userData.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Account Number</label>
                      <p className="mt-1 text-sm text-gray-900" data-testid="text-account-number">{userData.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Plan Type</label>
                      <p className="mt-1 text-sm text-gray-900" data-testid="text-plan-type">{userData.plan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Account Status</label>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {mockUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;