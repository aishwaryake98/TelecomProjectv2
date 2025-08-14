import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp
} from "lucide-react";

function Dashboard() {
  // Mock user data for demonstration
  const mockUser = {
    name: "Aishwarya KE",
    email: "aishwaryake1998@gmail.com",
    phone: "+91 98765 43210",
    accountNumber: "TC-743263530",
    plan: "Premium Unlimited",
    status: "Active",
    activationDate: "Today",
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUser.name}</h1>
              <p className="text-gray-600">Account: {mockUser.accountNumber}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {mockUser.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
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
                  <div className="text-2xl font-bold">{mockUser.usage.data.used} GB</div>
                  <p className="text-xs text-muted-foreground">
                    of {mockUser.usage.data.total} GB used
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(mockUser.usage.data.used / mockUser.usage.data.total) * 100}%` }}
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
                  <div className="text-2xl font-bold">{mockUser.usage.calls.used}</div>
                  <p className="text-xs text-muted-foreground">
                    of {mockUser.usage.calls.total} minutes used
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(mockUser.usage.calls.used / mockUser.usage.calls.total) * 100}%` }}
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
                  <div className="text-2xl font-bold">₹{mockUser.billing.currentBill}</div>
                  <p className="text-xs text-muted-foreground">
                    Due {mockUser.billing.dueDate}
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
                      <span className="font-semibold">{mockUser.usage.data.used} GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${(mockUser.usage.data.used / mockUser.usage.data.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {mockUser.usage.data.total - mockUser.usage.data.used} GB remaining
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
                        <span className="font-semibold">{mockUser.usage.calls.used}/{mockUser.usage.calls.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(mockUser.usage.calls.used / mockUser.usage.calls.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>SMS Messages</span>
                        <span className="font-semibold">{mockUser.usage.sms.used}/{mockUser.usage.sms.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(mockUser.usage.sms.used / mockUser.usage.sms.total) * 100}%` }}
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
                      <span>Plan ({mockUser.plan})</span>
                      <span className="font-semibold">₹899</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxes & Fees</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span>₹{mockUser.billing.currentBill}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Due Date: {mockUser.billing.dueDate}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Bill
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
                      <p className="mt-1 text-sm text-gray-900">{mockUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900">{mockUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900">{mockUser.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Account Number</label>
                      <p className="mt-1 text-sm text-gray-900">{mockUser.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Plan Type</label>
                      <p className="mt-1 text-sm text-gray-900">{mockUser.plan}</p>
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