
import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, Snowflake, Sun, Sparkles } from 'lucide-react';

interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  background: string;
  description: string;
  category?: string;
  icon?: React.ReactNode;
}

const presets: ThemePreset[] = [
  // Original themes
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    primaryColor: '#0EA5E9',
    secondaryColor: '#38BDF8',
    accentColor: '#7DD3FC',
    background: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)',
    description: 'Calm and professional blue tones',
    category: 'classic'
  },
  {
    id: 'forest',
    name: 'Forest Haven',
    primaryColor: '#22C55E',
    secondaryColor: '#4ADE80',
    accentColor: '#86EFAC',
    background: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)',
    description: 'Natural and refreshing green shades',
    category: 'classic'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    primaryColor: '#F97316',
    secondaryColor: '#FB923C',
    accentColor: '#FDBA74',
    background: 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
    description: 'Warm and inviting orange hues',
    category: 'classic'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    accentColor: '#C4B5FD',
    background: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
    description: 'Calming purple tones',
    category: 'classic'
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    primaryColor: '#EC4899',
    secondaryColor: '#F472B6',
    accentColor: '#F9A8D4',
    background: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    description: 'Vibrant pink and red tones',
    category: 'classic'
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6',
    accentColor: '#93C5FD',
    background: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
    description: 'Deep, rich blue tones',
    category: 'classic'
  },
  {
    id: 'emerald',
    name: 'Emerald City',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    accentColor: '#6EE7B7',
    background: 'linear-gradient(90deg, hsla(168, 76%, 36%, 1) 0%, hsla(141, 84%, 34%, 1) 100%)',
    description: 'Rich emerald and teal tones',
    category: 'classic'
  },
  {
    id: 'ruby',
    name: 'Ruby Red',
    primaryColor: '#DC2626',
    secondaryColor: '#EF4444',
    accentColor: '#FCA5A5',
    background: 'linear-gradient(90deg, hsla(0, 91%, 71%, 1) 0%, hsla(340, 82%, 59%, 1) 100%)',
    description: 'Bold and passionate red hues',
    category: 'classic'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    primaryColor: '#4B5563',
    secondaryColor: '#6B7280',
    accentColor: '#9CA3AF',
    background: 'linear-gradient(90deg, hsla(217, 10%, 25%, 1) 0%, hsla(215, 16%, 47%, 1) 100%)',
    description: 'Sleek and modern gray tones',
    category: 'classic'
  },
  
  // New Christmas themes
  {
    id: 'christmas-traditional',
    name: 'Christmas Classic',
    primaryColor: '#C01F1F',
    secondaryColor: '#146B3A',
    accentColor: '#F8B229',
    background: 'linear-gradient(90deg, #146B3A 0%, #C01F1F 100%)',
    description: 'Traditional red and green Christmas colors',
    category: 'seasonal',
    icon: <Snowflake className="h-4 w-4 text-white absolute top-2 right-2" />
  },
  {
    id: 'christmas-frost',
    name: 'Winter Frost',
    primaryColor: '#4A6FA5',
    secondaryColor: '#85C1E9',
    accentColor: '#FFFFFF',
    background: 'linear-gradient(90deg, #C9D6DF 0%, #F0F5F9 100%)',
    description: 'Frosty blue and white winter theme',
    category: 'seasonal',
    icon: <Snowflake className="h-4 w-4 text-blue-500 absolute top-2 right-2" />
  },
  
  // New summer themes
  {
    id: 'summer-beach',
    name: 'Beach Day',
    primaryColor: '#00B4D8',
    secondaryColor: '#FFB703',
    accentColor: '#FF9500',
    background: 'linear-gradient(90deg, #00B4D8 0%, #90E0EF 100%)',
    description: 'Bright and sunny beach vibes',
    category: 'seasonal',
    icon: <Sun className="h-4 w-4 text-yellow-400 absolute top-2 right-2" />
  },
  {
    id: 'summer-tropical',
    name: 'Tropical Paradise',
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    accentColor: '#FFE66D',
    background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)',
    description: 'Vibrant tropical summer colors',
    category: 'seasonal',
    icon: <Sun className="h-4 w-4 text-yellow-400 absolute top-2 right-2" />
  },
  
  // New gradient themes
  {
    id: 'gradient-sunset',
    name: 'Sunset Gradient',
    primaryColor: '#FF9966',
    secondaryColor: '#FF5E62',
    accentColor: '#FFC371',
    background: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
    description: 'Smooth sunset gradient palette',
    category: 'gradient',
    icon: <Sparkles className="h-4 w-4 text-yellow-200 absolute top-2 right-2" />
  },
  {
    id: 'gradient-cosmic',
    name: 'Cosmic Purple',
    primaryColor: '#8E2DE2',
    secondaryColor: '#4A00E0',
    accentColor: '#C9D6FF',
    background: 'linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)',
    description: 'Deep space purple gradient',
    category: 'gradient',
    icon: <Sparkles className="h-4 w-4 text-purple-200 absolute top-2 right-2" />
  },
  {
    id: 'gradient-emerald',
    name: 'Emerald Waters',
    primaryColor: '#11998e',
    secondaryColor: '#38ef7d',
    accentColor: '#C9F9E9',
    background: 'linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)',
    description: 'Refreshing green gradient',
    category: 'gradient',
    icon: <Sparkles className="h-4 w-4 text-green-200 absolute top-2 right-2" />
  },
  {
    id: 'gradient-dusk',
    name: 'Dusk',
    primaryColor: '#2C3E50',
    secondaryColor: '#FD746C',
    accentColor: '#FE8A7A',
    background: 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
    description: 'Evening sky gradient',
    category: 'gradient',
    icon: <Sparkles className="h-4 w-4 text-blue-200 absolute top-2 right-2" />
  }
];

const ThemePresets: React.FC = () => {
  const { preferences, updatePreference } = useSettings();

  // Apply saved theme on component mount
  useEffect(() => {
    if (preferences?.themePreset) {
      const selectedPreset = presets.find(preset => preset.id === preferences.themePreset);
      if (selectedPreset) {
        applyThemeToDOM(selectedPreset);
      }
    }
  }, [preferences?.themePreset]);

  // Helper function to apply theme colors to DOM
  const applyThemeToDOM = (preset: ThemePreset) => {
    // Remove existing theme classes
    document.body.classList.remove(...presets.map(p => `theme-preset-${p.id}`));
    
    // Add the new theme class
    document.body.classList.add(`theme-preset-${preset.id}`);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--theme-primary', preset.primaryColor);
    document.documentElement.style.setProperty('--theme-secondary', preset.secondaryColor);
    document.documentElement.style.setProperty('--theme-accent', preset.accentColor);
    document.documentElement.style.setProperty('--theme-background', preset.background);
    
    // Apply primary color to button backgrounds for immediate visual feedback
    document.documentElement.style.setProperty('--primary', preset.primaryColor.replace('#', 'hsl('));
    
    // Apply to specific UI elements for immediate feedback
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
      (button as HTMLElement).style.backgroundColor = preset.primaryColor;
    });
  };

  const applyTheme = (preset: ThemePreset) => {
    // Apply theme to DOM
    applyThemeToDOM(preset);
    
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
    document.body.classList.remove(...presets.map(p => `theme-preset-${p.id}`));
    
    // Reset all theme-related CSS variables
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-secondary');
    document.documentElement.style.removeProperty('--theme-accent');
    document.documentElement.style.removeProperty('--theme-background');
    document.documentElement.style.removeProperty('--primary');
    
    // Update preference
    updatePreference('themePreset', null);
    toast.success('Theme reset to default');
  };

  // Group presets by category
  const classicPresets = presets.filter(preset => preset.category === 'classic' || !preset.category);
  const seasonalPresets = presets.filter(preset => preset.category === 'seasonal');
  const gradientPresets = presets.filter(preset => preset.category === 'gradient');

  // Render preset cards by category
  const renderPresetCards = (presetList: ThemePreset[]) => {
    return presetList.map((preset) => (
      <div 
        key={preset.id}
        className="cursor-pointer group"
        onClick={() => applyTheme(preset)}
      >
        <Card className={`overflow-hidden h-40 transition-all hover:scale-105 hover:shadow-md border-2 relative ${preferences?.themePreset === preset.id ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
          {preset.icon}
          <div 
            className="h-24 w-full" 
            style={{ background: preset.background }}
          />
          <div className="p-2 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-sm">{preset.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
            </div>
            {preferences?.themePreset === preset.id && (
              <span className="bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
        </Card>
      </div>
    ));
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
      
      {/* Classic Themes */}
      <div className="space-y-2 mt-4">
        <h3 className="font-medium text-sm">Classic Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderPresetCards(classicPresets)}
        </div>
      </div>
      
      {/* Seasonal Themes */}
      <div className="space-y-2 mt-6">
        <h3 className="font-medium text-sm">Seasonal Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderPresetCards(seasonalPresets)}
        </div>
      </div>
      
      {/* Gradient Themes */}
      <div className="space-y-2 mt-6">
        <h3 className="font-medium text-sm">Gradient Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderPresetCards(gradientPresets)}
        </div>
      </div>
    </div>
  );
};

export default ThemePresets;
