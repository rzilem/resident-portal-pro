
import React, { useEffect, useRef, useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [currentColor, setCurrentColor] = useState(color);
  
  // Update the local state when the prop changes
  useEffect(() => {
    setCurrentColor(color);
  }, [color]);
  
  // Update the parent component when the color changes
  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };
  
  // The preset colors that users can quickly select
  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FF5733', '#C70039', 
    '#900C3F', '#581845', '#FFC300', '#DAF7A6', '#2E86C1'
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <HexColorPicker 
            color={currentColor} 
            onChange={handleColorChange}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-32 space-y-3">
          <div>
            <Label htmlFor="hex-color" className="text-xs block mb-1">Hex Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="h-6 w-6 rounded-md border" 
                style={{ backgroundColor: currentColor }}
              ></div>
              <HexColorInput 
                id="hex-color"
                color={currentColor}
                onChange={handleColorChange}
                prefixed
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs block mb-1">Opacity</Label>
            <Slider
              defaultValue={[100]}
              max={100}
              step={1}
              className="py-2"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-xs block mb-2">Preset Colors</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="h-6 w-6 rounded-md border cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: presetColor }}
              onClick={() => handleColorChange(presetColor)}
              aria-label={`Select color ${presetColor}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};
