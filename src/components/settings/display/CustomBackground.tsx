
import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Image, Upload, Link2 } from 'lucide-react';

const backgroundPatterns = [
  {
    id: 'grid',
    name: 'Grid',
    url: "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"
  },
  {
    id: 'dots',
    name: 'Dots',
    url: "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"
  },
  {
    id: 'stripes',
    name: 'Stripes',
    url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E"
  },
  {
    id: 'waves',
    name: 'Waves',
    url: "data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.655-1.248 2.67-3.457 5.09-5.218 8.52 1.524 16.19 5.97 26.91 6.356 11.106.39 11.428-2.24 13.456-7.74.28-.744.746-2.258 1.084-3.246.34-1.188.37-2.095-.334-2.86-.704-.767-2.417-.85-3.656-.425-1.445.5-1.986 2.08-3.46 1.815-.55-.098-.662-.094-1.1.066-.855.316-1.066 1.683-1.3 2.505-.05.173-.097.408-.146.646-.278 1.32-.576 2.743-2.296 2.352-1.9-.15-2.955-1.725-4.35-3.126-3.91-3.922-11.29-5.16-17.03-3.366-3.27 1.015-5.43 5.256-5.43 5.256s-1.27-1.95-7.174-3.138c-5.86-1.177-9.9 1.093-9.9 1.093s-.027-1.238-.13-2.976c-.093-1.56-.477-3.98-1.42-4.14-1.373-.233-3.307.893-3.307 3.476 0 .883.224 1.656.868 2.307.47.468.984.66 1.358.66.53 0 1.075-.42 1.28-.978.13-.356.183-.557.613-.967.234-.224.542-.357.673-.613.363-.702-.007-1.843-.766-2.286-.357-.207-.625-.594-.754-.975-.19-.55-.19-1.2.094-1.88.934-2.21 2.307-5.6.934-8.376C29.885.12 25.935-.657 22.97.34c-3.07 1.035-4.887 5.162-6.7 8.35-1.034 1.797-1.957 3.332-2.584 4.29-2.688 4.08-3.48 3.907-3.813 8.412l-.02.338c-.076 2.643-.094 3.241-.73 5.603-.154.558.272 2.1.19 2.62-.09.56-.513 1.743-1.63 1.61-.524-.06-2.5-.55-2.852-.666-1.075-.345-1.735-.225-1.735-.225' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"
  }
];

const CustomBackground: React.FC = () => {
  const { preferences, updatePreference } = useSettings();
  const [imgUrl, setImgUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('url');

  // Initialize state from saved preferences
  useEffect(() => {
    if (preferences?.customBackground) {
      // Set the correct tab based on saved background type
      if (preferences.customBackground.type === 'url') {
        setActiveTab('url');
        setImgUrl(preferences.customBackground.value);
      } else if (preferences.customBackground.type === 'data') {
        setActiveTab('upload');
        setPreviewUrl(preferences.customBackground.value);
      } else if (preferences.customBackground.type === 'pattern') {
        setActiveTab('patterns');
      }
      
      // Apply the background based on type
      document.body.classList.add('custom-background');
      
      if (preferences.customBackground.type === 'pattern') {
        document.body.classList.add('background-pattern');
        document.body.classList.remove('background-image');
        
        const pattern = backgroundPatterns.find(p => p.id === preferences.customBackground.value);
        if (pattern) {
          document.body.style.backgroundImage = `url(${pattern.url})`;
        }
      } else {
        document.body.classList.add('background-image');
        document.body.classList.remove('background-pattern');
        document.body.style.backgroundImage = `url(${preferences.customBackground.value})`;
      }
    }
  }, [preferences?.customBackground]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const applyUrlBackground = () => {
    if (!imgUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }
    
    // Update DOM
    document.body.classList.add('custom-background', 'background-image');
    document.body.classList.remove('background-pattern');
    document.body.style.backgroundImage = `url(${imgUrl})`;
    
    // Update preference
    updatePreference('customBackground', { type: 'url', value: imgUrl });
    
    // Clear theme preset if one is active
    if (preferences?.themePreset) {
      document.body.classList.remove(
        'theme-preset-ocean',
        'theme-preset-forest',
        'theme-preset-sunset',
        'theme-preset-lavender',
        'theme-preset-cherry',
        'theme-preset-midnight'
      );
      updatePreference('themePreset', null);
    }
    
    toast.success('Background image applied');
  };

  const applyUploadedBackground = () => {
    if (!previewUrl) {
      toast.error('Please upload an image first');
      return;
    }
    
    // Update DOM
    document.body.classList.add('custom-background', 'background-image');
    document.body.classList.remove('background-pattern');
    document.body.style.backgroundImage = `url(${previewUrl})`;
    
    // Update preference
    updatePreference('customBackground', { type: 'data', value: previewUrl });
    
    // Clear theme preset if one is active
    if (preferences?.themePreset) {
      document.body.classList.remove(
        'theme-preset-ocean',
        'theme-preset-forest',
        'theme-preset-sunset',
        'theme-preset-lavender',
        'theme-preset-cherry',
        'theme-preset-midnight'
      );
      updatePreference('themePreset', null);
    }
    
    toast.success('Background image applied');
  };

  const applyPatternBackground = (pattern: any) => {
    // Update DOM
    document.body.classList.add('custom-background', 'background-pattern');
    document.body.classList.remove('background-image');
    document.body.style.backgroundImage = `url(${pattern.url})`;
    
    // Update preference
    updatePreference('customBackground', { type: 'pattern', value: pattern.id });
    
    // Clear theme preset if one is active
    if (preferences?.themePreset) {
      document.body.classList.remove(
        'theme-preset-ocean',
        'theme-preset-forest',
        'theme-preset-sunset',
        'theme-preset-lavender',
        'theme-preset-cherry',
        'theme-preset-midnight'
      );
      updatePreference('themePreset', null);
    }
    
    toast.success(`${pattern.name} pattern applied`);
  };

  const clearBackground = () => {
    // Update DOM
    document.body.classList.remove('custom-background', 'background-pattern', 'background-image');
    document.body.style.backgroundImage = 'none';
    
    // Update preference
    updatePreference('customBackground', null);
    
    toast.success('Background cleared');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Custom Background</Label>
        <Button variant="outline" size="sm" onClick={clearBackground}>
          Clear Background
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Personalize your interface with a custom background
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="url">
            <Link2 className="h-4 w-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <Image className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="bg-url">Image URL</Label>
            <Input 
              id="bg-url" 
              placeholder="https://example.com/image.jpg" 
              value={imgUrl} 
              onChange={(e) => setImgUrl(e.target.value)}
            />
          </div>
          
          {imgUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img 
                src={imgUrl} 
                alt="Background preview" 
                className="w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x200?text=Invalid+Image+URL';
                  toast.error('Could not load the image. Please check the URL.');
                }}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button onClick={applyUrlBackground} disabled={!imgUrl}>Apply</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="bg-file">Upload Image</Label>
            <Input 
              id="bg-file" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img 
                src={previewUrl} 
                alt="Background preview" 
                className="w-full h-32 object-cover rounded-md border" 
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button onClick={applyUploadedBackground} disabled={!previewUrl}>Apply</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {backgroundPatterns.map((pattern) => (
              <div 
                key={pattern.id}
                className={`border rounded-md p-2 cursor-pointer ${
                  preferences?.customBackground?.type === 'pattern' && 
                  preferences.customBackground.value === pattern.id 
                    ? 'border-primary' 
                    : 'hover:border-primary'
                }`}
                onClick={() => applyPatternBackground(pattern)}
              >
                <div 
                  className="h-16 w-full rounded mb-2" 
                  style={{ backgroundImage: `url(${pattern.url})` }}
                />
                <p className="text-sm font-medium text-center">{pattern.name}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomBackground;
