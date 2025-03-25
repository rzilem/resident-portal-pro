
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

const WeatherWidget = ({ size = 'medium' }: WeatherWidgetProps) => {
  // This would typically fetch real weather data
  const weather = {
    temperature: 72,
    condition: 'Partly Cloudy',
    high: 78,
    low: 65,
    precipitation: '10%',
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-amber-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snowy':
        return <Snowflake className="h-8 w-8 text-blue-300" />;
      default:
        return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Local Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weather.temperature}°F</div>
            <p className="text-muted-foreground">{weather.condition}</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground">High</p>
            <p className="font-medium">{weather.high}°F</p>
          </div>
          <div>
            <p className="text-muted-foreground">Low</p>
            <p className="font-medium">{weather.low}°F</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rain</p>
            <p className="font-medium">{weather.precipitation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
