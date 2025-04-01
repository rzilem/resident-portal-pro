
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LeadErrorAlertProps {
  title?: string;
  message: string;
}

const LeadErrorAlert: React.FC<LeadErrorAlertProps> = ({ 
  title = "An error occurred", 
  message 
}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default LeadErrorAlert;
