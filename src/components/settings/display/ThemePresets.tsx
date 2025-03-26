
import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  background: string;
  description: string;
}

const presets: ThemePreset[] = [
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    primaryColor: '#0EA5E9',
    secondaryColor: '#38BDF8',
    accentColor: '#7DD3FC',
    background: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)',
    description: 'Calm and professional blue tones'
  },
  {
    id: 'forest',
    name: 'Forest Haven',
    primaryColor: '#22C55E',
    secondaryColor: '#4ADE80',
    accentColor: '#86EFAC',
    background: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)',
    description: 'Natural and refreshing green shades'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    primaryColor: '#F97316',
    secondaryColor: '#FB923C',
    accentColor: '#FDBA74',
    background: 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
    description: 'Warm and inviting orange hues'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    accentColor: '#C4B5FD',
    background: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
    description: 'Calming purple tones'
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    primaryColor: '#EC4899',
    secondaryColor: '#F472B6',
    accentColor: '#F9A8D4',
    background: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    description: 'Vibrant pink and red tones'
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6',
    accentColor: '#93C5FD',
    background: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
    description: 'Deep, rich blue tones'
  }
];

const ThemePresets: React.FC = () => {
  const { preferences, updatePreference } = useSettings();

  // Apply saved theme on component mount
  useEffect(() => {
    if (preferences?.themePreset) {
      const selectedPreset = presets.find(preset => preset.id === preferences.themePreset);
      if (selectedPreset) {
        // Apply theme classes
        document.body.classList.remove(
          'theme-preset-ocean',
          'theme-preset-forest',
          'theme-preset-sunset',
          'theme-preset-lavender',
          'theme-preset-cherry',
          'theme-preset-midnight'
        );
        document.body.classList.add(`theme-preset-${selectedPreset.id}`);
        
        // Apply theme colors to CSS variables
        document.documentElement.style.setProperty('--theme-primary', selectedPreset.primaryColor);
        document.documentElement.style.setProperty('--theme-secondary', selectedPreset.secondaryColor);
        document.documentElement.style.setProperty('--theme-accent', selectedPreset.accentColor);
        document.documentElement.style.setProperty('--theme-background', selectedPreset.background);
      }
    }
  }, [preferences?.themePreset]);

  const applyTheme = (preset: ThemePreset) => {
    // Remove existing theme classes
    document.body.classList.remove(
      'theme-preset-ocean',
      'theme-preset-forest',
      'theme-preset-sunset',
      'theme-preset-lavender',
      'theme-preset-cherry',
      'theme-preset-midnight'
    );
    
    // Add the new theme class
    document.body.classList.add(`theme-preset-${preset.id}`);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--theme-primary', preset.primaryColor);
    document.documentElement.style.setProperty('--theme-secondary', preset.secondaryColor);
    document.documentElement.style.setProperty('--theme-accent', preset.accentColor);
    document.documentElement.style.setProperty('--theme-background', preset.background);
    
    // Clear any custom colors when applying a preset
    if (preferences?.customColors) {
      updatePreference('customColors', null);
    }
    
    // Clear any custom background when applying a preset
    if (preferences?.customBackground) {
      updatePreference('customBackground', null);
      // This will ensure body background is cleared
      document.body.style.backgroundImage = 'none';
      document.body.classList.remove('custom-background', 'background-pattern', 'background-image');
    }
    
    // Save theme preference
    updatePreference('themePreset', preset.id);
    toast.success(`${preset.name} theme applied`);
  };

  const resetTheme = () => {
    // Remove existing theme classes
    document.body.classList.remove(
      'theme-preset-ocean',
      'theme-preset-forest',
      'theme-preset-sunset',
      'theme-preset-lavender',
      'theme-preset-cherry',
      'theme-preset-midnight'
    );
    
    // Reset all theme-related CSS variables
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-secondary');
    document.documentElement.style.removeProperty('--theme-accent');
    document.documentElement.style.removeProperty('--theme-background');
    
    // Update preference
    updatePreference('themePreset', null);
    toast.success('Theme reset to default');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Theme Presets</Label>
        <Button variant="outline" size="sm" onClick={resetTheme}>
          Reset Theme
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Choose from our pre-designed themes to instantly transform your interface
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <div 
            key={preset.id}
            className="cursor-pointer group"
            onClick={() => applyTheme(preset)}
          >
            <Card className={`overflow-hidden h-40 transition-all hover:scale-105 hover:shadow-md border-2 ${preferences?.themePreset === preset.id ? 'border-primary' : 'hover:border-primary'}`}>
              <div 
                className="h-24 w-full" 
                style={{ background: preset.background }}
              />
              <div className="p-2">
                <h3 className="font-medium text-sm">{preset.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePresets;
