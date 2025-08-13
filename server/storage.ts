import { type OnboardingApplication, type InsertOnboardingApplication, type UpdateOnboardingApplication, type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Onboarding Applications
  createOnboardingApplication(application: InsertOnboardingApplication): Promise<OnboardingApplication>;
  getOnboardingApplication(id: string): Promise<OnboardingApplication | undefined>;
  updateOnboardingApplication(id: string, updates: UpdateOnboardingApplication): Promise<OnboardingApplication | undefined>;
  getAllOnboardingApplications(): Promise<OnboardingApplication[]>;
  
  // Documents
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByApplicationId(applicationId: string): Promise<Document[]>;
  
  // Mock OCR and Verification
  simulateOCRExtraction(documentType: string): Promise<any>;
  simulateDocumentVerification(extractedData: any): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private onboardingApplications: Map<string, OnboardingApplication>;
  private documents: Map<string, Document>;

  constructor() {
    this.onboardingApplications = new Map();
    this.documents = new Map();
  }

  async createOnboardingApplication(insertApp: InsertOnboardingApplication): Promise<OnboardingApplication> {
    const id = randomUUID();
    const now = new Date();
    const application: OnboardingApplication = {
      ...insertApp,
      id,
      accountNumber: null,
      createdAt: now,
      updatedAt: now
    };
    this.onboardingApplications.set(id, application);
    return application;
  }

  async getOnboardingApplication(id: string): Promise<OnboardingApplication | undefined> {
    return this.onboardingApplications.get(id);
  }

  async updateOnboardingApplication(id: string, updates: UpdateOnboardingApplication): Promise<OnboardingApplication | undefined> {
    const existing = this.onboardingApplications.get(id);
    if (!existing) return undefined;

    const updated: OnboardingApplication = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    this.onboardingApplications.set(id, updated);
    return updated;
  }

  async getAllOnboardingApplications(): Promise<OnboardingApplication[]> {
    return Array.from(this.onboardingApplications.values());
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDoc,
      id,
      uploadedAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocumentsByApplicationId(applicationId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.applicationId === applicationId
    );
  }

  async simulateOCRExtraction(documentType: string): Promise<any> {
    // Mock OCR data based on document type
    const mockData = {
      aadhaar: {
        name: "Rajesh Kumar Singh",
        idNumber: "XXXX-XXXX-1234",
        dob: "15/08/1985",
        address: "Mumbai, Maharashtra",
        documentType: "Aadhaar Card"
      },
      pan: {
        name: "Rajesh Kumar Singh",
        idNumber: "ABCDE1234F",
        dob: "15/08/1985",
        documentType: "PAN Card"
      },
      passport: {
        name: "Rajesh Kumar Singh",
        idNumber: "A1234567",
        dob: "15/08/1985",
        documentType: "Passport"
      }
    };

    return mockData[documentType as keyof typeof mockData] || mockData.aadhaar;
  }

  async simulateDocumentVerification(extractedData: any): Promise<boolean> {
    // Mock verification logic - always return true for demo
    return true;
  }
}

export const storage = new MemStorage();
