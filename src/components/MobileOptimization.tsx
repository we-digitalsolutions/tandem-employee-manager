
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Download,
  Bell,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileOptimization = () => {
  const isMobile = useIsMobile();

  const mobileFeatures = [
    {
      title: 'Responsive Design',
      description: 'Optimized layouts for all screen sizes',
      icon: Smartphone,
      status: 'active'
    },
    {
      title: 'Touch Gestures',
      description: 'Native touch interactions and swipe gestures',
      icon: Tablet,
      status: 'active'
    },
    {
      title: 'Offline Support',
      description: 'Basic functionality works without internet',
      icon: Wifi,
      status: 'planned'
    },
    {
      title: 'Push Notifications',
      description: 'Real-time updates and alerts',
      icon: Bell,
      status: 'planned'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mobile Experience</h1>
          <p className="text-gray-600">Optimized for mobile and tablet devices</p>
        </div>
        <Badge variant={isMobile ? "default" : "outline"}>
          {isMobile ? 'Mobile View' : 'Desktop View'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Current Device Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Mobile</p>
              <p className="text-sm text-gray-600">&lt; 768px</p>
              <Badge variant={isMobile ? "default" : "outline"} className="mt-2">
                {isMobile ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Tablet className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Tablet</p>
              <p className="text-sm text-gray-600">768px - 1024px</p>
              <Badge variant="outline" className="mt-2">Auto</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Desktop</p>
              <p className="text-sm text-gray-600">&gt; 1024px</p>
              <Badge variant={!isMobile ? "default" : "outline"} className="mt-2">
                {!isMobile ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mobileFeatures.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <feature.icon className="h-5 w-5" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">{feature.description}</p>
              <Badge 
                variant={feature.status === 'active' ? 'default' : 'outline'}
                className="capitalize"
              >
                {feature.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mobile App Installation (PWA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Install this app on your mobile device for a native-like experience.
          </p>
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Install App
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              App Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOptimization;
