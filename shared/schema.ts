import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const onboardingApplications = pgTable("onboarding_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  address: text("address").notNull(),
  documentsUploaded: jsonb("documents_uploaded").default([]),
  extractedData: jsonb("extracted_data"),
  verificationStatus: text("verification_status").default("pending"),
  consentGiven: boolean("consent_given").default(false),
  otpVerified: boolean("otp_verified").default(false),
  smsOtpVerified: boolean("sms_otp_verified").default(false),
  digitalSignature: text("digital_signature"),
  kycStatus: text("kyc_status").default("pending"),
  serviceActivated: boolean("service_activated").default(false),
  accountNumber: text("account_number"),
  planType: text("plan_type").default("Premium Unlimited"),
  notificationsSent: boolean("notifications_sent").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => onboardingApplications.id),
  fileName: text("file_name").notNull(),
  fileSize: text("file_size").notNull(),
  fileType: text("file_type").notNull(),
  documentType: text("document_type").notNull(), // aadhaar, pan, passport
  uploadedAt: timestamp("uploaded_at").default(sql`now()`)
});

export const insertOnboardingApplicationSchema = createInsertSchema(onboardingApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  accountNumber: true
});

export const updateOnboardingApplicationSchema = createInsertSchema(onboardingApplications).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true
});

export type InsertOnboardingApplication = z.infer<typeof insertOnboardingApplicationSchema>;
export type UpdateOnboardingApplication = z.infer<typeof updateOnboardingApplicationSchema>;
export type OnboardingApplication = typeof onboardingApplications.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
