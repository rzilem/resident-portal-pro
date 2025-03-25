
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Loader2 } from 'lucide-react';

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
  location?: string;
}

const WeatherWidget = ({ size = 'small', cardClass = '', location = 'New York' }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = () => {
      setLoading(true);
      setTimeout(() => {
        const conditions = ['sunny', 'cloudy', 'rainy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        setWeather({
          temp: Math.floor(Math.random() * 35) + 50, // 50-85°F
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
          windSpeed: Math.floor(Math.random() * 15) + 2, // 2-17 mph
        });
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = () => {
    if (weather) {
      switch (weather.condition) {
        case 'sunny':
          return <Sun size={24} className="text-yellow-500" />;
        case 'cloudy':
          return <Cloud size={24} className="text-gray-500" />;
        case 'rainy':
          return <CloudRain size={24} className="text-blue-500" />;
        default:
          return <Sun size={24} className="text-yellow-500" />;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Card className={`${cardClass}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${cardClass}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Weather in {location}</CardTitle>
      </CardHeader>
      <CardContent>
        {weather && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {getWeatherIcon()}
              <div>
                <div className="text-2xl font-bold">{weather.temp}°F</div>
                <div className="capitalize text-muted-foreground">{weather.condition}</div>
              </div>
            </div>
            
            {size !== 'small' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Humidity:</span> {weather.humidity}%
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Wind:</span> {weather.windSpeed} mph
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
