
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useSignup } from '@/hooks/use-signup';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signupValues, isLoading, handleInputChange, handleSignup } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    handleSignup(e, onSwitchToLogin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName-register">First name</Label>
          <Input
            id="firstName-register"
            placeholder="John"
            value={signupValues.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName-register">Last name</Label>
          <Input
            id="lastName-register"
            placeholder="Doe"
            value={signupValues.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input
          id="email-register"
          type="email"
          placeholder="hello@example.com"
          value={signupValues.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password-register">Password</Label>
        <Input
          id="password-register"
          type="password"
          placeholder="••••••••"
          value={signupValues.password}
          onChange={handleInputChange}
          required
          minLength={6}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
          I agree to the <a href="#" className="text-primary underline hover:text-primary/80">terms of service</a> and <a href="#" className="text-primary underline hover:text-primary/80">privacy policy</a>
        </Label>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </span>
        ) : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignupForm;
