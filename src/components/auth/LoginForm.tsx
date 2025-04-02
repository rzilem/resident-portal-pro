
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useLogin } from '@/hooks/use-login';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthProvider';

const LoginForm: React.FC = () => {
  const { loginValues, isLoading, handleInputChange, handleLogin } = useLogin();
  const [isResetting, setIsResetting] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!loginValues.email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await resetPassword(loginValues.email);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent. Please check your inbox.", {
          duration: 5000
        });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("An error occurred while sending the reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="hello@example.com"
          value={loginValues.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button 
            type="button" 
            variant="link" 
            className="px-0 h-auto text-sm font-normal"
            onClick={handleResetPassword}
            disabled={isResetting}
          >
            {isResetting ? 'Sending...' : 'Forgot password?'}
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={loginValues.password}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </span>
        ) : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
