
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Predefined credentials for internal employee (kept for demo purposes)
const INTERNAL_CREDENTIALS = {
  email: "admin@residentpro.com",
  password: "admin123"
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });
  const [signupValues, setSignupValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginValues({ ...loginValues, [id]: value });
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupValues({ ...signupValues, [id.replace('-register', '')]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First try Supabase authentication
      const { error } = await signIn(loginValues.email, loginValues.password);
      
      if (error) {
        console.log("Supabase auth error:", error);
        
        // Fallback to demo credentials for development
        if (loginValues.email === INTERNAL_CREDENTIALS.email && 
            loginValues.password === INTERNAL_CREDENTIALS.password) {
          toast.success("Login successful with demo account! Welcome back.");
          
          // Store legacy auth state in localStorage (for backward compatibility)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', loginValues.email);
          
          // Navigate to dashboard after successful login
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          toast.error(error.message || "Invalid credentials. Please try again.");
        }
      } else {
        toast.success("Login successful! Welcome back.");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!signupValues.firstName || !signupValues.lastName) {
      toast.error("Please provide your first and last name.");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error, data } = await signUp(
        signupValues.email, 
        signupValues.password, 
        {
          first_name: signupValues.firstName,
          last_name: signupValues.lastName
        }
      );
      
      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success(
          "Registration successful! You can now sign in.", 
          { duration: 5000 }
        );
        // Switch to login tab
        document.querySelector('[data-state="inactive"][data-value="login"]')?.click();
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent/30 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Background decorative elements */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>
        
        <div className="glass-panel bg-white/95 p-8 rounded-xl border border-border shadow-lg backdrop-blur-md relative z-10 animate-scale-in">
          <div className="mb-6 text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-gradient">ResidentPro</h1>
            </Link>
            <p className="text-muted-foreground mt-2">Access your community dashboard</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-fade-in">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={loginValues.email}
                    onChange={handleLoginInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-primary/90 hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginValues.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="animate-fade-in">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName-register">First name</Label>
                    <Input
                      id="firstName-register"
                      placeholder="John"
                      value={signupValues.firstName}
                      onChange={handleSignupInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName-register">Last name</Label>
                    <Input
                      id="lastName-register"
                      placeholder="Doe"
                      value={signupValues.lastName}
                      onChange={handleSignupInputChange}
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
                    onChange={handleSignupInputChange}
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
                    onChange={handleSignupInputChange}
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
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
