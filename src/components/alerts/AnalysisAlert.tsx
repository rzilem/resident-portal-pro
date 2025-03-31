
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Alert as AlertType } from '@/types/alert';

interface AnalysisAlertProps {
  alert: AlertType;
  className?: string;
}

const AnalysisAlert: React.FC<AnalysisAlertProps> = ({ alert, className = '' }) => {
  // Only show alerts that are new or in-progress
  if (alert.status === 'resolved' || alert.status === 'dismissed') {
    return null;
  }
  
  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-medium">
        <span>{alert.title}</span>
      </AlertTitle>
      <AlertDescription>
        {alert.description}
      </AlertDescription>
    </Alert>
  );
};

export default AnalysisAlert;
