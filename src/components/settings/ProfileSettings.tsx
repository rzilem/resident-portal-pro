
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserRound, Mail, Phone, MapPin, Building } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    jobTitle: "Property Manager",
    address: "123 Main St, Anytown, CA 12345",
    bio: "Experienced property manager with 10+ years in residential community management."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="pl-10" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="pl-10" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="pl-10" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="jobTitle" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    className="pl-10" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="pl-10" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground border">
              <UserRound className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Upload a new photo in JPG, PNG or GIF format. Maximum size 2MB.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm">
                  Upload New Picture
                </Button>
                <Button type="button" variant="outline" size="sm" className="text-destructive">
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default ProfileSettings;
