
import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from './ColorPicker';
import { Palette, Circle, Square } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ColorState {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

const defaultColors: ColorState = {
  primary: '#8B5CF6',
  secondary: '#A78BFA',
  accent: '#C4B5FD',
  background: '#FFFFFF',
  text: '#1F2937',
  border: '#E5E7EB'
};

const ColorCustomizer: React.FC = () => {
  const { preferences, updatePreference } = useSettings();
  const [colors, setColors] = useState<ColorState>(defaultColors);
  const [activeColor, setActiveColor] = useState<keyof ColorState>('primary');
  const [isApplied, setIsApplied] = useState(false);

  // Initialize from saved preferences
  useEffect(() => {
    if (preferences?.customColors) {
      setColors(preferences.customColors);
      setIsApplied(true);
      
      // Apply saved colors to CSS variables
      applyColorsToDOM(preferences.customColors);
    } else {
      setIsApplied(false);
    }
  }, [preferences?.customColors]);

  const applyColorsToDOM = (colorState: ColorState) => {
    // Clear any theme preset first
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-preset-')) {
        document.body.classList.remove(className);
      }
    });
    
    // Remove any theme-specific variables
    document.documentElement.style.removeProperty('--theme-primary');
    document.documentElement.style.removeProperty('--theme-secondary');
    document.documentElement.style.removeProperty('--theme-accent');
    document.documentElement.style.removeProperty('--theme-background');
    
    // Apply custom colors
    document.documentElement.style.setProperty('--color-primary', colorState.primary);
    document.documentElement.style.setProperty('--color-secondary', colorState.secondary);
    document.documentElement.style.setProperty('--color-accent', colorState.accent);
    document.documentElement.style.setProperty('--color-background', colorState.background);
    document.documentElement.style.setProperty('--color-text', colorState.text);
    document.documentElement.style.setProperty('--color-border', colorState.border);
    
    // Update primary color for immediate feedback
    document.documentElement.style.setProperty('--primary', colorState.primary);
    
    // Mark that custom colors have been applied
    document.body.classList.add('custom-colors-applied');
  };

  const updateColor = (color: string) => {
    setColors(prev => ({
      ...prev,
      [activeColor]: color
    }));
  };

  const applyColors = () => {
    // Apply colors to DOM
    applyColorsToDOM(colors);
    
    // Clear theme preset if one is active
    if (preferences?.themePreset) {
      updatePreference('themePreset', null);
    }
    
    // Save to preferences
    updatePreference('customColors', colors);
    setIsApplied(true);
    toast.success('Custom colors applied');
  };

  const resetColors = () => {
    // Reset colors state
    setColors(defaultColors);
    
    // Remove CSS variables
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
    document.documentElement.style.removeProperty('--color-background');
    document.documentElement.style.removeProperty('--color-text');
    document.documentElement.style.removeProperty('--color-border');
    document.documentElement.style.removeProperty('--primary');
    
    // Remove custom colors class
    document.body.classList.remove('custom-colors-applied');
    
    // Clear from preferences
    updatePreference('customColors', null);
    setIsApplied(false);
    toast.success('Colors reset to default');
  };

  const applyPalette = (colors: [string, string, string]) => {
    setColors(prev => ({
      ...prev,
      primary: colors[0],
      secondary: colors[1],
      accent: colors[2]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Color Customizer</Label>
        <Button variant="outline" size="sm" onClick={resetColors} disabled={!isApplied}>
          Reset Colors
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Customize the colors of your interface to match your brand or preferences
      </p>
      
      <Tabs defaultValue="wheel" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="wheel">
            <Circle className="h-4 w-4 mr-2" />
            Color Wheel
          </TabsTrigger>
          <TabsTrigger value="palette">
            <Palette className="h-4 w-4 mr-2" />
            Palette
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Square className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wheel" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 space-y-3">
              <Label>Select Element to Customize</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(colors).map((colorKey) => (
                  <Button
                    key={colorKey}
                    variant={activeColor === colorKey ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setActiveColor(colorKey as keyof ColorState)}
                  >
                    <div 
                      className="h-4 w-4 rounded-full mr-2" 
                      style={{ background: colors[colorKey as keyof ColorState] }}
                    />
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator orientation="vertical" className="hidden md:block" />
            
            <div className="w-full md:w-2/3">
              <Label className="mb-4 block">
                Customize {activeColor.charAt(0).toUpperCase() + activeColor.slice(1)} Color
              </Label>
              <ColorPicker 
                color={colors[activeColor]} 
                onChange={updateColor} 
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={applyColors}>Apply Colors</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="palette" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Primary Blue', colors: ['#0EA5E9', '#38BDF8', '#7DD3FC'] },
              { name: 'Forest Green', colors: ['#22C55E', '#4ADE80', '#86EFAC'] },
              { name: 'Sunset Orange', colors: ['#F97316', '#FB923C', '#FDBA74'] },
              { name: 'Royal Purple', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'] },
              { name: 'Rose Pink', colors: ['#EC4899', '#F472B6', '#F9A8D4'] },
              { name: 'Slate Gray', colors: ['#475569', '#64748B', '#94A3B8'] }
            ].map((palette, index) => (
              <div 
                key={index}
                className="cursor-pointer border rounded p-2 hover:border-primary"
                onClick={() => applyPalette(palette.colors as [string, string, string])}
              >
                <div className="flex h-8 rounded overflow-hidden mb-2">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ background: color }}></div>
                  ))}
                </div>
                <p className="text-xs font-medium text-center">{palette.name}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button onClick={applyColors}>Apply Colors</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <div className="p-4 rounded-md" style={{ background: colors.background, color: colors.text, borderColor: colors.border, borderWidth: '1px' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Preview Your Custom Theme</h3>
            <p className="mb-3">This is how your theme will look with the selected colors.</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="px-3 py-1 rounded" style={{ background: colors.primary, color: '#FFF' }}>
                Primary Button
              </button>
              <button className="px-3 py-1 rounded" style={{ background: colors.secondary, color: '#FFF' }}>
                Secondary
              </button>
              <button className="px-3 py-1 rounded" style={{ background: colors.accent, color: '#000' }}>
                Accent
              </button>
            </div>
            
            <div className="p-3 rounded" style={{ background: 'rgba(0,0,0,0.05)', borderColor: colors.border, borderWidth: '1px' }}>
              <p className="text-sm">This is a sample card with your theme colors.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button onClick={applyColors}>Apply Colors</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorCustomizer;

