
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const SignUp = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            <div>
              <Input type="text" placeholder="Name" />
            </div>
            <div>
              <Input type="email" placeholder="Email" />
            </div>
            <div>
              <Input type="password" placeholder="Password" />
            </div>
            <div>
              <Input type="password" placeholder="Confirm Password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign Up</Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
