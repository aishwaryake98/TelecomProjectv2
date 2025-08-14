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
    // Simulate OCR processing with realistic extraction patterns
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    const generateRealisticData = () => {
      const names = ["Aishwarya KE", "Rajesh Kumar Singh", "Priya Sharma", "Amit Patel", "Sunita Devi"];
      const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];
      const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh", "West Bengal"];
      
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomState = states[Math.floor(Math.random() * states.length)];
      
      return { randomName, randomCity, randomState };
    };

    const { randomName, randomCity, randomState } = generateRealisticData();

    const extractionPatterns = {
      aadhaar: {
        name: randomName,
        idNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        dob: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(1960 + Math.random() * 40)}`,
        address: `${Math.floor(1 + Math.random() * 999)} ${['MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road'][Math.floor(Math.random() * 4)]}, ${randomCity}, ${randomState}`,
        documentType: "Aadhaar Card",
        gender: Math.random() > 0.5 ? "Male" : "Female",
        fatherName: `${randomName.split(' ')[0]} Kumar`,
        pincode: `${Math.floor(100000 + Math.random() * 900000)}`
      },
      pan: {
        name: randomName,
        idNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        dob: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(1960 + Math.random() * 40)}`,
        documentType: "PAN Card",
        fatherName: `${randomName.split(' ')[0]} Kumar`
      },
      passport: {
        name: randomName,
        idNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000000 + Math.random() * 9000000)}`,
        dob: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(1960 + Math.random() * 40)}`,
        documentType: "Passport",
        nationality: "Indian",
        placeOfBirth: randomCity,
        issueDate: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(2015 + Math.random() * 8)}`,
        expiryDate: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(2025 + Math.random() * 10)}`
      },
      "driving-license": {
        name: randomName,
        idNumber: `${randomState.substring(0, 2).toUpperCase()}${Math.floor(10 + Math.random() * 90)}${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
        dob: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(1960 + Math.random() * 40)}`,
        documentType: "Driving License",
        address: `${Math.floor(1 + Math.random() * 999)} ${['MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road'][Math.floor(Math.random() * 4)]}, ${randomCity}, ${randomState}`,
        vehicleClass: "LMV",
        issueDate: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(2015 + Math.random() * 8)}`,
        validUpto: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(2025 + Math.random() * 15)}`
      },
      "voter-id": {
        name: randomName,
        idNumber: `${randomState.substring(0, 3).toUpperCase()}${Math.floor(1000000 + Math.random() * 9000000)}`,
        dob: `${Math.floor(1 + Math.random() * 28)}/${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${Math.floor(1960 + Math.random() * 40)}`,
        documentType: "Voter ID Card",
        address: `${Math.floor(1 + Math.random() * 999)} ${['MG Road', 'Brigade Road', 'Commercial Street', 'Residency Road'][Math.floor(Math.random() * 4)]}, ${randomCity}, ${randomState}`,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        fatherName: `${randomName.split(' ')[0]} Kumar`
      }
    };

    const result = extractionPatterns[documentType as keyof typeof extractionPatterns] || extractionPatterns.aadhaar;
    
    // Add confidence scores to simulate real OCR
    return {
      ...result,
      confidence: Math.round((85 + Math.random() * 14) * 100) / 100, // 85-99% confidence
      processingTime: `${(1.2 + Math.random() * 0.8).toFixed(1)}s`,
      extractedFields: Object.keys(result).length - 1
    };
  }

  async simulateDocumentVerification(extractedData: any): Promise<boolean> {
    // Mock verification logic - always return true for demo
    return true;
  }
}

export const storage = new MemStorage();
