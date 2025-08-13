import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, CreditCard, IdCard, FileImage } from "lucide-react";

function DocumentUpload({ applicationId, onNext, onPrev }) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (files) => {
      if (!applicationId) throw new Error("No application ID");
      
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('documents', file);
      });
      formData.append('documentType', 'aadhaar'); // Default, should be detected

      const response = await fetch(`/api/onboarding/applications/${applicationId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setUploadedDocs(prev => [...prev, ...data.documents]);
      toast({
        title: "Documents Uploaded",
        description: "Your documents have been uploaded successfully."
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const canProceed = uploadedDocs.length > 0;

  return (
    <div>
      <h3 className="text-xl font-semibold text-neutral-dark mb-6">KYC Document Upload</h3>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <IdCard className="text-blue-600 text-2xl mb-2 mx-auto" />
          <h4 className="font-medium text-neutral-dark">Aadhaar Card</h4>
          <p className="text-xs text-neutral-medium mt-1">Government ID</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <CreditCard className="text-orange-500 text-2xl mb-2 mx-auto" />
          <h4 className="font-medium text-neutral-dark">PAN Card</h4>
          <p className="text-xs text-neutral-medium mt-1">Tax Identity</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <FileImage className="text-green-500 text-2xl mb-2 mx-auto" />
          <h4 className="font-medium text-neutral-dark">Passport</h4>
          <p className="text-xs text-neutral-medium mt-1">Alternative ID</p>
        </div>
      </div>

      {/* Document Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="mb-4">
          <Upload className="text-4xl text-neutral-medium mx-auto" />
        </div>
        <h4 className="text-lg font-medium text-neutral-dark mb-2">Drop your documents here</h4>
        <p className="text-neutral-medium mb-4">or click to browse files</p>
        <Button 
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={uploadMutation.isPending}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploadMutation.isPending ? "Uploading..." : "Browse Files"}
        </Button>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          multiple 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedDocs.length > 0 && (
        <div className="mt-6 space-y-3">
          <h5 className="font-medium text-neutral-dark">Uploaded Documents</h5>
          {uploadedDocs.map((doc) => (
            <div key={doc.id} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="text-red-500 text-xl mr-3" />
              <div className="flex-1">
                <div className="font-medium text-neutral-dark">{doc.fileName}</div>
                <div className="text-sm text-neutral-medium">{doc.fileSize} • Uploaded successfully</div>
              </div>
              <CheckCircle className="text-green-500 text-xl" />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          onClick={onPrev} 
          variant="outline"
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default DocumentUpload;