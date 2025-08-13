# Overview

This is a telecom customer onboarding application built with React (frontend) and Express.js (backend). The system provides a multi-step onboarding flow for new telecom customers, including customer registration, document upload and verification, consent collection, KYC approval, and service activation. The application uses a modern tech stack with TypeScript, Tailwind CSS for styling, shadcn/ui components, and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React 18 using TypeScript and follows a component-based architecture:

- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement in development

The frontend follows a modular structure with reusable UI components and dedicated onboarding flow components for each step of the customer journey.

## Backend Architecture
The server-side application uses Express.js with TypeScript in an ESM module configuration:

- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with structured endpoints for onboarding operations
- **File Handling**: Multer middleware for document uploads with file type validation
- **Error Handling**: Centralized error handling middleware
- **Validation**: Zod schemas for request validation
- **Development**: tsx for TypeScript execution in development

The backend implements a clean separation between route handlers and business logic through a storage abstraction layer.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Migration**: Drizzle Kit for database migrations
- **Connection**: @neondatabase/serverless for serverless PostgreSQL connections
- **Schema**: Shared schema definitions between frontend and backend

The database schema includes tables for onboarding applications and document storage with proper relationships and constraints.

## Authentication and Authorization
Currently implements a session-based approach:

- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: CORS handling and secure cookie configuration
- **File Upload Security**: File type validation and size limits for document uploads

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: TypeScript ORM for database operations
- **connect-pg-simple**: PostgreSQL session store for Express

### UI and Styling
- **shadcn/ui**: Complete UI component library built on Radix UI
- **Radix UI**: Primitive components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for both client and server
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### File Upload and Processing
- **Multer**: Middleware for handling multipart/form-data file uploads
- **File Type Validation**: Built-in validation for PDF, JPEG, and PNG files

### State Management and API
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight routing library for React

The application is designed for deployment on Replit with specific configurations for the Replit environment, including development banner integration and cartographer plugin support.