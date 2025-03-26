
import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address: string;
  apiKey?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address, apiKey }) => {
  const mapRef = useRef<HTMLIFrameElement>(null);
  const formattedAddress = encodeURIComponent(address);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-border">
      <iframe
        ref={mapRef}
        className="w-full h-full"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey || 'AIzaSyDLR8zMh_Uwsjso4-rXZ_BB6ZZY-eCdFDQ'}&q=${formattedAddress}`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GoogleMap;
