
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Alert as AlertType } from '@/types/alert';
import FixThisButton from './FixThisButton';

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
      <AlertTitle className="font-medium flex justify-between items-center">
        <span>{alert.title}</span>
        <FixThisButton 
          alert={alert} 
          variant="outline" 
          size="sm"
          className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
        />
      </AlertTitle>
      <AlertDescription>
        {alert.description}
      </AlertDescription>
    </Alert>
  );
};

export default AnalysisAlert;
