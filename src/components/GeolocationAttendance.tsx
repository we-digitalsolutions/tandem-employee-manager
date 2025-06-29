
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationConstraint {
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

interface GeolocationAttendanceProps {
  allowedLocations: LocationConstraint[];
  onClockIn: (location: { latitude: number; longitude: number; address?: string }) => void;
  onClockOut: (location: { latitude: number; longitude: number; address?: string }) => void;
  isClocked: boolean;
}

const GeolocationAttendance = ({ 
  allowedLocations, 
  onClockIn, 
  onClockOut, 
  isClocked 
}: GeolocationAttendanceProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [nearestLocation, setNearestLocation] = useState<LocationConstraint | null>(null);
  const [address, setAddress] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLocationStatus('checking');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(location);
        checkLocationConstraints(location);
        reverseGeocode(location);
      },
      (error) => {
        setLocationStatus('error');
        let message = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkLocationConstraints = (location: { latitude: number; longitude: number }) => {
    if (allowedLocations.length === 0) {
      setLocationStatus('allowed');
      return;
    }

    let isWithinConstraints = false;
    let nearest: LocationConstraint | null = null;
    let minDistance = Infinity;

    for (const constraint of allowedLocations) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        constraint.latitude,
        constraint.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = constraint;
      }

      if (distance <= constraint.radius) {
        isWithinConstraints = true;
        break;
      }
    }

    setNearestLocation(nearest);
    setLocationStatus(isWithinConstraints ? 'allowed' : 'denied');
  };

  const reverseGeocode = async (location: { latitude: number; longitude: number }) => {
    try {
      // Using a free geocoding service (in real app, you'd use Google Maps API or similar)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
      );
      const data = await response.json();
      setAddress(data.display_name || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
    } catch (error) {
      setAddress(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
    }
  };

  const handleClockAction = () => {
    if (!currentLocation) return;

    const locationData = {
      ...currentLocation,
      address
    };

    if (isClocked) {
      onClockOut(locationData);
    } else {
      onClockIn(locationData);
    }
  };

  const getStatusIcon = () => {
    switch (locationStatus) {
      case 'checking':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'allowed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (locationStatus) {
      case 'checking':
        return 'Checking your location...';
      case 'allowed':
        return nearestLocation 
          ? `You're at ${nearestLocation.name}` 
          : 'Location verified - you can clock in/out';
      case 'denied':
        return nearestLocation
          ? `You're not within range of ${nearestLocation.name}. Please move closer to clock in.`
          : 'You\'re not at an authorized location for clock in/out';
      case 'error':
        return 'Unable to verify location. Please check your settings.';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location-Based Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium">{getStatusMessage()}</p>
            {address && (
              <p className="text-sm text-gray-600">{address}</p>
            )}
          </div>
          <Badge variant={locationStatus === 'allowed' ? 'default' : 'secondary'}>
            {locationStatus}
          </Badge>
        </div>

        {locationStatus === 'denied' && nearestLocation && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to be within {nearestLocation.radius}m of {nearestLocation.name} to clock in/out.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleClockAction}
            disabled={locationStatus !== 'allowed'}
            className="flex-1"
            variant={isClocked ? "destructive" : "default"}
          >
            {isClocked ? 'Clock Out' : 'Clock In'}
          </Button>
          
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            disabled={locationStatus === 'checking'}
          >
            Refresh Location
          </Button>
        </div>

        {allowedLocations.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Authorized Locations:</h4>
            <div className="space-y-2">
              {allowedLocations.map((location, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{location.name}</span>
                  <Badge variant="outline">{location.radius}m radius</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeolocationAttendance;
