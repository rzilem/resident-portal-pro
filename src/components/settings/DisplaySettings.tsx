import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSettings } from '@/hooks/use-settings';
import { Loader2, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import ThemePresets from './display/ThemePresets';
import ColorCustomizer from './display/ColorCustomizer';
import CustomBackground from './display/CustomBackground';
import LogoUploader from './display/LogoUploader';
import { PRESET_GREETINGS } from '@/utils/presetGreetings';
import { useVoiceGreeting } from '@/hooks/use-voice-greeting';
import { toast } from 'sonner';

const DisplaySettings = () => {
  const { preferences, updatePreference, isLoading } = useSettings();
  const { resetGreeting } = useVoiceGreeting();

  const handleToggleAnimations = (checked: boolean) => {
    updatePreference('animations', checked);
  };

  const handleToggleDensity = (density: string) => {
    updatePreference('density', density);
  };

  const handleToggleCardStyle = (style: string) => {
    updatePreference('cardStyle', style);
  };
  
  const handleToggleVoiceGreeting = (checked: boolean) => {
    updatePreference('voiceGreetingEnabled', checked);
  };
  
  const handleChangeGreetingType = (type: string) => {
    updatePreference('voiceGreetingType', type);
  };
  
  const handleChangeCustomGreeting = (greeting: string) => {
    updatePreference('customGreeting', greeting);
  };
  
  const handleSelectPresetGreeting = (presetId: string) => {
    updatePreference('selectedPresetGreeting', presetId);
  };

  const handleTestGreeting = () => {
    resetGreeting();
    toast.success('Greeting reset! Navigate to dashboard to hear it');
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="interface">
        <TabsList className="mb-4">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interface Settings</CardTitle>
              <CardDescription>
                Customize how the application interface appears and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations" className="text-base">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable interface animations
                    </p>
                  </div>
                  <Switch 
                    id="animations" 
                    checked={preferences.animations !== false}
                    onCheckedChange={handleToggleAnimations}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voice-greeting" className="text-base">Voice Greeting</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable voice greeting on dashboard
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {preferences.voiceGreetingEnabled ? 
                      <Volume2 className="w-4 h-4 text-muted-foreground" /> : 
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    }
                    <Switch 
                      id="voice-greeting" 
                      checked={preferences.voiceGreetingEnabled !== false}
                      onCheckedChange={handleToggleVoiceGreeting}
                    />
                  </div>
                </div>
                
                {preferences.voiceGreetingEnabled !== false && (
                  <div className="pl-4 border-l-2 border-muted space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Greeting Type</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleTestGreeting}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Test Greeting
                        </Button>
                      </div>
                      <RadioGroup 
                        value={preferences.voiceGreetingType || 'default'} 
                        onValueChange={handleChangeGreetingType}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="greeting-default" />
                          <Label htmlFor="greeting-default" className="cursor-pointer">
                            Default time-based greeting
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="preset" id="greeting-preset" />
                          <Label htmlFor="greeting-preset" className="cursor-pointer">
                            Select from preset greetings
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="greeting-custom" />
                          <Label htmlFor="greeting-custom" className="cursor-pointer">
                            Custom greeting
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {preferences.voiceGreetingType === 'preset' && (
                      <div className="space-y-2">
                        <Label>Select Preset</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {PRESET_GREETINGS.map((preset) => (
                            <div 
                              key={preset.id}
                              className={`rounded-md p-3 cursor-pointer ${
                                preferences.selectedPresetGreeting === preset.id 
                                  ? 'bg-primary/10 border border-primary/50' 
                                  : 'border hover:bg-secondary/50'
                              }`}
                              onClick={() => handleSelectPresetGreeting(preset.id)}
                            >
                              <div className="font-medium">{preset.title}</div>
                              <div className="text-sm text-muted-foreground mt-1">{preset.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {preferences.voiceGreetingType === 'custom' && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-greeting">Custom Greeting Text</Label>
                        <Textarea 
                          id="custom-greeting"
                          placeholder="Enter your custom greeting. Use {name} to include the user's name."
                          value={preferences.customGreeting || ''}
                          onChange={(e) => handleChangeCustomGreeting(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use {'{name}'} in your text to include the user's name. Example: "Welcome {'{name}'}, your dashboard is ready."
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="density">Table Density</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.density === 'compact' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleDensity('compact')}
                  >
                    Compact
                  </button>
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.density === 'default' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleDensity('default')}
                  >
                    Default
                  </button>
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.density === 'spacious' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleDensity('spacious')}
                  >
                    Spacious
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-style">Card Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.cardStyle === 'default' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleCardStyle('default')}
                  >
                    Default
                  </button>
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.cardStyle === 'flat' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleCardStyle('flat')}
                  >
                    Flat
                  </button>
                  <button
                    className={`rounded-md border p-2 text-sm ${preferences.cardStyle === 'glass' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                    onClick={() => handleToggleCardStyle('glass')}
                  >
                    Glass
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-6">
          <ThemePresets />
          <ColorCustomizer />
          <CustomBackground />
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-6">
          <LogoUploader />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisplaySettings;
