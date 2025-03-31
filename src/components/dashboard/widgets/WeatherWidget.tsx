
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Droplets, Wind, Thermometer, Sun, Cloud, CloudRain, CloudSnow, CloudFog, MapPin, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
  config?: {
    location?: string;
  };
}

const WeatherWidget = ({ size = 'small', cardClass = '', config }: WeatherWidgetProps) => {
  const { toast } = useToast();
  const [location, setLocation] = useState("Austin, TX"); // Fixed to Austin, TX
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'forecast'>('current');
  
  // Weather icons based on condition
  const getWeatherIcon = (condition: string, size: 'sm' | 'md' | 'lg' = 'lg') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-16 w-16',
    };
    
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={`${sizeClasses[size]} text-amber-400`} />;
      case 'partly cloudy':
        return <CloudSun className={`${sizeClasses[size]} text-blue-400`} />;
      case 'cloudy':
        return <Cloud className={`${sizeClasses[size]} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${sizeClasses[size]} text-blue-500`} />;
      case 'snowy':
        return <CloudSnow className={`${sizeClasses[size]} text-blue-200`} />;
      case 'foggy':
        return <CloudFog className={`${sizeClasses[size]} text-gray-300`} />;
      default:
        return <CloudSun className={`${sizeClasses[size]} text-blue-400`} />;
    }
  };

  // Mock weather data for Austin, TX (in a real app, this would come from a weather API)
  const weatherData = {
    temperature: 84,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 84, low: 68, condition: 'Partly Cloudy' },
      { day: 'Tue', high: 87, low: 71, condition: 'Sunny' },
      { day: 'Wed', high: 81, low: 65, condition: 'Cloudy' },
      { day: 'Thu', high: 79, low: 64, condition: 'Rainy' },
      { day: 'Fri', high: 83, low: 69, condition: 'Partly Cloudy' },
      { day: 'Sat', high: 85, low: 70, condition: 'Sunny' },
      { day: 'Sun', high: 82, low: 68, condition: 'Cloudy' },
    ]
  };

  // Simulate loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRefreshWeather = () => {
    setLoading(true);
    toast({
      title: "Refreshing Weather",
      description: "Fetching latest weather data...",
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Weather Updated",
        description: "Latest weather data has been loaded",
      });
    }, 1500);
  };

  const handleLocationClick = () => {
    toast({
      title: "Change Location",
      description: "You can change your weather location in settings",
    });
  };

  if (loading) {
    return (
      <Card className={`${cardClass}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <CloudSun className="h-4 w-4" /> Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse mb-4" />
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md mb-2" />
            <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCurrentWeather = () => (
    <div className="bg-gradient-to-br from-blue-400 to-sky-500 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center cursor-pointer" onClick={handleLocationClick}>
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </h3>
          <p className="text-3xl font-bold mt-1">{weatherData.temperature}°F</p>
          <p className="text-sm text-blue-100">{weatherData.condition}</p>
        </div>
        <div>
          {getWeatherIcon(weatherData.condition)}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-blue-100">
        <div className="flex items-center">
          <Droplets className="h-4 w-4 mr-1" /> {weatherData.humidity}%
        </div>
        <div className="flex items-center">
          <Wind className="h-4 w-4 mr-1" /> {weatherData.windSpeed} mph
        </div>
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 mr-1" /> Feels like {weatherData.temperature - 2}°F
        </div>
      </div>
      
      <div className="mt-3 text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:text-white hover:bg-white/20 p-1 h-7"
          onClick={handleRefreshWeather}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Refresh</span>
        </Button>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="bg-gradient-to-br from-blue-400 to-sky-500 text-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium flex items-center cursor-pointer" onClick={handleLocationClick}>
          <MapPin className="h-3 w-3 mr-1" />
          {location} - 5 Day Forecast
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:text-white hover:bg-white/20 p-1 h-7"
          onClick={handleRefreshWeather}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {weatherData.forecast.slice(0, 5).map((day, index) => (
          <div key={index} className="flex flex-col items-center bg-white/10 rounded-lg p-2">
            <p className="text-xs font-bold mb-1">{day.day}</p>
            <div className="my-1">
              {getWeatherIcon(day.condition, 'md')}
            </div>
            <div className="flex flex-col items-center text-xs">
              <span className="font-medium">{day.high}°</span>
              <span className="text-blue-200">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={`${cardClass} overflow-hidden`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-b">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="h-4 w-4" /> Weather
          </div>
          
          <Tabs defaultValue="current" className="w-auto" onValueChange={(value) => setActiveTab(value as 'current' | 'forecast')}>
            <TabsList className="h-8 bg-blue-50/50 dark:bg-blue-900/20">
              <TabsTrigger value="current" className="text-xs px-3 py-1">Current</TabsTrigger>
              <TabsTrigger value="forecast" className="text-xs px-3 py-1">5-Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activeTab === 'current' ? renderCurrentWeather() : renderForecast()}
        
        {activeTab === 'current' && size !== 'small' && (
          <div className="flex justify-between px-4 py-3 border-t">
            {weatherData.forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs font-medium">{day.day}</p>
                <div className="my-1">
                  {getWeatherIcon(day.condition.toLowerCase(), 'sm')}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
