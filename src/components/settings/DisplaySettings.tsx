
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Monitor, Palette, Image as ImageIcon, Grid, Building } from "lucide-react";
import { useSettings } from '@/hooks/use-settings';
import { useTheme } from '@/hooks/use-theme';
import ThemePresets from './display/ThemePresets';
import CustomBackground from './display/CustomBackground';
import ColorCustomizer from './display/ColorCustomizer';
import LogoUploader from './display/LogoUploader';

const DisplaySettings = () => {
  const { preferences, updatePreference, isLoading } = useSettings();
  const { theme, setTheme } = useTheme();
  
  const [localTheme, setLocalTheme] = useState(theme || "light");
  const [cardStyle, setCardStyle] = useState("default");
  const [density, setDensity] = useState("comfortable");
  const [animations, setAnimations] = useState(true);
  
  useEffect(() => {
    if (preferences) {
      setLocalTheme(preferences.theme || "light");
      setCardStyle(preferences.cardStyle || "default");
      setDensity(preferences.density || "comfortable");
      setAnimations(preferences.animations !== undefined ? preferences.animations : true);
    }
  }, [preferences]);

  const handleThemeChange = (value: string) => {
    if (!value) return;
    
    const newTheme = value as "light" | "dark" | "system";
    setLocalTheme(newTheme);
    setTheme(newTheme);
    updatePreference("theme", newTheme);
  };

  useEffect(() => {
    document.body.classList.remove('card-style-default', 'card-style-flat', 'card-style-glass');
    document.body.classList.add(`card-style-${cardStyle}`);
    
    document.body.classList.remove('density-comfortable', 'density-compact');
    document.body.classList.add(`density-${density}`);
    
    if (animations) {
      document.body.classList.remove('animations-disabled');
    } else {
      document.body.classList.add('animations-disabled');
    }
  }, [cardStyle, density, animations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePreference("cardStyle", cardStyle);
      await updatePreference("density", density);
      await updatePreference("animations", animations);
    } catch (error) {
      console.error("Error saving display settings:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Customize the appearance of your interface</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="basic">
                  <Monitor className="h-4 w-4 mr-2" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <Grid className="h-4 w-4 mr-2" />
                  Themes
                </TabsTrigger>
                <TabsTrigger value="background">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Background
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="branding">
                  <Building className="h-4 w-4 mr-2" />
                  Branding
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme Mode</Label>
                  <ToggleGroup 
                    type="single" 
                    value={localTheme} 
                    onValueChange={handleThemeChange}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="light" aria-label="Light Mode">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Dark Mode">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" aria-label="System Mode">
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-4">
                  <Label>Card Style</Label>
                  <RadioGroup 
                    value={cardStyle} 
                    onValueChange={setCardStyle} 
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="card-default" />
                      <Label htmlFor="card-default" className="font-normal cursor-pointer">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flat" id="card-flat" />
                      <Label htmlFor="card-flat" className="font-normal cursor-pointer">Flat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="glass" id="card-glass" />
                      <Label htmlFor="card-glass" className="font-normal cursor-pointer">Glass Morphism</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label>Layout Density</Label>
                  <RadioGroup 
                    value={density} 
                    onValueChange={setDensity} 
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable" id="density-comfortable" />
                      <Label htmlFor="density-comfortable" className="font-normal cursor-pointer">Comfortable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="density-compact" />
                      <Label htmlFor="density-compact" className="font-normal cursor-pointer">Compact</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="animations" className="font-normal cursor-pointer">
                    Enable animations
                  </Label>
                  <Switch 
                    id="animations" 
                    checked={animations} 
                    onCheckedChange={setAnimations} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="presets">
                <ThemePresets />
              </TabsContent>
              
              <TabsContent value="background">
                <CustomBackground />
              </TabsContent>
              
              <TabsContent value="colors">
                <ColorCustomizer />
              </TabsContent>
              
              <TabsContent value="branding">
                <div className="space-y-6">
                  <LogoUploader />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Layout</CardTitle>
            <CardDescription>Customize your dashboard widgets and layout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">Dashboard customization options coming soon</p>
              <Button variant="outline" className="mt-4" disabled>
                Customize Layout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default DisplaySettings;
