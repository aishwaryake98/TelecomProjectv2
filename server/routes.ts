import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertOnboardingApplicationSchema, updateOnboardingApplicationSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";
import { sendOTPEmail, verifyOTP, sendWelcomeEmail } from "./email";
import { sendSMSOTP, verifySMSOTP, resendSMSOTP } from "./sms";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create onboarding application
  app.post("/api/onboarding/applications", async (req, res) => {
    try {
      const validatedData = insertOnboardingApplicationSchema.parse(req.body);
      const application = await storage.createOnboardingApplication(validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Get onboarding application
  app.get("/api/onboarding/applications/:id", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Update onboarding application
  app.patch("/api/onboarding/applications/:id", async (req, res) => {
    try {
      const validatedData = updateOnboardingApplicationSchema.parse(req.body);
      const application = await storage.updateOnboardingApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Upload documents
  app.post("/api/onboarding/applications/:id/documents", upload.array('documents', 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedDocs = [];
      for (const file of files) {
        const documentData = {
          applicationId: req.params.id,
          fileName: file.originalname,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          fileType: file.mimetype,
          documentType: req.body.documentType || 'aadhaar' // Should be determined from file analysis
        };

        const document = await storage.createDocument(documentData);
        uploadedDocs.push(document);
      }

      // Update application with uploaded documents
      const application = await storage.getOnboardingApplication(req.params.id);
      if (application) {
        const existingDocs = Array.isArray(application.documentsUploaded) ? application.documentsUploaded : [];
        await storage.updateOnboardingApplication(req.params.id, {
          documentsUploaded: [...existingDocs, ...uploadedDocs]
        });
      }

      res.json({ documents: uploadedDocs });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  // Get documents for application
  app.get("/api/onboarding/applications/:id/documents", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByApplicationId(req.params.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Simulate OCR processing
  app.post("/api/onboarding/applications/:id/ocr", async (req, res) => {
    try {
      const { documentType } = req.body;
      const extractedData = await storage.simulateOCRExtraction(documentType);
      
      // Update application with extracted data
      await storage.updateOnboardingApplication(req.params.id, {
        extractedData,
        verificationStatus: 'processing'
      });

      res.json({ extractedData });
    } catch (error) {
      res.status(500).json({ message: "Failed to process OCR" });
    }
  });

  // Simulate document verification
  app.post("/api/onboarding/applications/:id/verify", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const isVerified = await storage.simulateDocumentVerification(application.extractedData);
      
      await storage.updateOnboardingApplication(req.params.id, {
        verificationStatus: isVerified ? 'verified' : 'failed'
      });

      res.json({ verified: isVerified });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify documents" });
    }
  });

  // Send OTP to email
  app.post("/api/onboarding/applications/:id/send-otp", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const result = await sendOTPEmail(application.email, application.firstName);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  // Submit consent and OTP
  app.post("/api/onboarding/applications/:id/consent", async (req, res) => {
    try {
      const { consents, otp, digitalSignature } = req.body;
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Verify OTP against user's email
      const otpVerification = verifyOTP(application.email, otp);
      
      await storage.updateOnboardingApplication(req.params.id, {
        consentGiven: consents?.every((c: boolean) => c) || false,
        otpVerified: otpVerification.valid,
        digitalSignature: digitalSignature || "digital_signature_hash"
      });

      res.json({ 
        success: true, 
        otpValid: otpVerification.valid,
        message: otpVerification.message
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process consent" });
    }
  });

  // KYC Approval
  app.post("/api/onboarding/applications/:id/approve", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if all requirements are met
      const canApprove = application.verificationStatus === 'verified' && 
                        application.consentGiven && 
                        application.otpVerified &&
                        application.smsOtpVerified;

      if (!canApprove) {
        return res.status(400).json({ message: "Requirements not met for approval" });
      }

      const accountNumber = `TC-${Math.random().toString().slice(2, 11)}`;
      
      await storage.updateOnboardingApplication(req.params.id, {
        kycStatus: 'approved',
        serviceActivated: true,
        accountNumber
      });

      res.json({ approved: true, accountNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to process approval" });
    }
  });

  // Send SMS OTP
  app.post("/api/onboarding/applications/:id/send-sms-otp", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const result = await sendSMSOTP(application.phone, `${application.firstName} ${application.lastName}`);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to send SMS OTP" });
    }
  });

  // Verify SMS OTP
  app.post("/api/onboarding/applications/:id/verify-sms-otp", async (req, res) => {
    try {
      const { otp } = req.body;
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const verification = verifySMSOTP(application.phone, otp);
      
      if (verification.valid) {
        await storage.updateOnboardingApplication(req.params.id, {
          smsOtpVerified: true
        });
      }

      res.json(verification);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify SMS OTP" });
    }
  });

  // Resend SMS OTP
  app.post("/api/onboarding/applications/:id/resend-sms-otp", async (req, res) => {
    try {
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const result = await resendSMSOTP(application.phone, `${application.firstName} ${application.lastName}`);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to resend SMS OTP" });
    }
  });

  // Send welcome notifications
  app.post("/api/onboarding/applications/:id/notifications", async (req, res) => {
    try {
      const { types } = req.body; // ['sms', 'email', 'push']
      const application = await storage.getOnboardingApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if notifications were already sent to prevent spam
      if (application.notificationsSent) {
        return res.json({ 
          notifications: { sms: true, push: true, email: true },
          message: "Notifications already sent"
        });
      }
      
      const results = {
        sms: types.includes('sms'),
        push: types.includes('push'),
        email: false
      };

      // Send welcome email if requested
      if (types.includes('email')) {
        const emailResult = await sendWelcomeEmail(
          application.email,
          `${application.firstName} ${application.lastName}`,
          application.accountNumber || "TC-000000000",
          application.planType || "Premium Unlimited"
        );
        results.email = emailResult.success;
      }

      // Mark notifications as sent
      await storage.updateOnboardingApplication(req.params.id, {
        notificationsSent: true
      });

      res.json({ notifications: results });
    } catch (error) {
      res.status(500).json({ message: "Failed to send notifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
