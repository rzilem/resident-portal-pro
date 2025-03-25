
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Loader2, Wind, CloudLightning, CloudSnow, CloudDrizzle } from 'lucide-react';

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
  location?: string;
}

const WeatherWidget = ({ size = 'small', cardClass = '', location = 'San Francisco' }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    forecast: Array<{day: string, temp: number, condition: string}>;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = () => {
      setLoading(true);
      setTimeout(() => {
        const conditions = ['sunny', 'cloudy', 'rainy', 'partly cloudy', 'stormy', 'snowy', 'drizzle'];
        const randomCondition = conditions[Math.floor(Math.random() * 4)]; // Mostly good weather :)
        
        setWeather({
          temp: Math.floor(Math.random() * 15) + 65, // 65-80°F for San Francisco
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 20) + 60, // 60-80%
          windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 mph
          forecast: [
            {day: 'Wed', temp: 72, condition: 'sunny'},
            {day: 'Thu', temp: 68, condition: 'partly cloudy'},
            {day: 'Fri', temp: 70, condition: 'cloudy'},
            {day: 'Sat', temp: 73, condition: 'sunny'},
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="text-blue-300" />;
      case 'cloudy':
        return <Cloud className="text-gray-500" />;
      case 'rainy':
        return <CloudRain className="text-blue-500" />;
      case 'stormy':
        return <CloudLightning className="text-purple-500" />;
      case 'snowy':
        return <CloudSnow className="text-blue-200" />;
      case 'drizzle':
        return <CloudDrizzle className="text-blue-400" />;
      default:
        return <Sun className="text-yellow-500" />;
    }
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
              <div className="h-10 w-10">
                {getWeatherIcon(weather.condition)}
              </div>
              <div>
                <div className="text-2xl font-bold">{weather.temp}°F</div>
                <div className="capitalize text-muted-foreground">{weather.condition}</div>
              </div>
            </div>
            
            {size !== 'small' && (
              <>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Humidity:</span> {weather.humidity}%
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Wind:</span> {weather.windSpeed} mph
                  </div>
                </div>
                
                {size === 'large' && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">4-Day Forecast</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {weather.forecast.map((day, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span className="text-xs">{day.day}</span>
                          <div className="h-6 w-6 my-1">
                            {getWeatherIcon(day.condition)}
                          </div>
                          <span className="text-xs font-medium">{day.temp}°</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
