
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth/AuthProvider';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Effect to redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log('Login component: User already logged in, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const switchToLoginTab = () => {
    setActiveTab("login");
  };

  const switchToRegisterTab = () => {
    setActiveTab("register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to ResidentPro</CardTitle>
          <CardDescription>
            Login to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <SignupForm onSwitchToLogin={switchToLoginTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {activeTab === "login" ? (
            <p className="w-full">
              Don't have an account?{" "}
              <button 
                onClick={switchToRegisterTab}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="w-full">
              Already have an account?{" "}
              <button 
                onClick={switchToLoginTab}
                className="text-primary hover:underline font-medium"
              >
                Login
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
