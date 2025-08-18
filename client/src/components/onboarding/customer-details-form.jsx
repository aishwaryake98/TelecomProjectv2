import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFormPersistence } from "@/hooks/use-form-persistence.js";
import CountrySelector from "@/components/ui/country-selector.jsx";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  countryCode: z.string().min(1, "Please select a country code"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(10, "Please enter your complete address")
});

function CustomerDetailsForm({ onNext, onPrev, onApplicationCreate }) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phone: "",
      dateOfBirth: "",
      address: ""
    }
  });

  // Enable form persistence - initialize saved data first
  const { clearPersistedData } = useFormPersistence('customer-details-form', form, true);

  const createApplicationMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/onboarding/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      onApplicationCreate(data.id);
      // Clear persisted form data after successful submission
      clearPersistedData();
      toast({
        title: "Application Created",
        description: "Your personal information has been saved successfully."
      });
      onNext();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values) => {
    // Combine country code and phone number
    const formattedData = {
      ...values,
      phone: `${values.countryCode} ${values.phone}`
    };
    createApplicationMutation.mutate(formattedData);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-neutral-dark mb-6">Personal Information</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code *</FormLabel>
                  <FormControl>
                    <CountrySelector 
                      value={field.value}
                      onValueChange={field.onChange}
                      data-testid="input-country-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="98765 43210" 
                      {...field} 
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your complete address including city, state, and pin code"
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between mt-8">
            <Button 
              type="button"
              onClick={onPrev} 
              variant="outline"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button 
              type="submit"
              disabled={createApplicationMutation.isPending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {createApplicationMutation.isPending ? "Saving..." : "Continue"} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CustomerDetailsForm;