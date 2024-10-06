import React from 'react';
import { Polyline } from 'react-native-maps';

interface LineRouteProps {
  coordinates: { latitude: number; longitude: number }[];
}

const LineRoute: React.FC<LineRouteProps> = ({ coordinates }) => {
  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="#42E100"
      strokeWidth={4}
    />
  );
};

export default LineRoute;
