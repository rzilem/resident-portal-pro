
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Droplets, Wind, Thermometer, Sun, Cloud, CloudRain, CloudSnow, CloudFog } from 'lucide-react';

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
  config?: {
    location?: string;
  };
}

const WeatherWidget = ({ size = 'small', cardClass = '', config }: WeatherWidgetProps) => {
  const location = config?.location || 'San Francisco, CA';
  const [loading, setLoading] = useState(false);
  
  // Weather icons based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-16 w-16 text-amber-400" />;
      case 'partly cloudy':
        return <CloudSun className="h-16 w-16 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="h-16 w-16 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-16 w-16 text-blue-500" />;
      case 'snowy':
        return <CloudSnow className="h-16 w-16 text-blue-200" />;
      case 'foggy':
        return <CloudFog className="h-16 w-16 text-gray-300" />;
      default:
        return <CloudSun className="h-16 w-16 text-blue-400" />;
    }
  };

  // Mock weather data (in a real app, this would come from a weather API)
  const weatherData = {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 48,
    windSpeed: 8,
    forecast: [
      { day: 'Today', high: 72, low: 58, condition: 'Partly Cloudy' },
      { day: 'Tue', high: 75, low: 60, condition: 'Sunny' },
      { day: 'Wed', high: 68, low: 57, condition: 'Cloudy' },
      { day: 'Thu', high: 65, low: 55, condition: 'Rainy' },
      { day: 'Fri', high: 70, low: 58, condition: 'Partly Cloudy' },
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

  return (
    <Card className={`${cardClass} overflow-hidden`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-b">
        <CardTitle className="text-md flex items-center gap-2">
          <CloudSun className="h-4 w-4" /> Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-blue-400 to-sky-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{location}</h3>
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
        </div>

        {size !== 'small' && (
          <div className="flex justify-between px-4 py-3 border-t">
            {weatherData.forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs font-medium">{day.day}</p>
                <div className="my-1">
                  {getWeatherIcon(day.condition.toLowerCase())}
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
