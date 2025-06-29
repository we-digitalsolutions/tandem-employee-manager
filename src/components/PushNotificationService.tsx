
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  leaveRequests: boolean;
  remoteRequests: boolean;
  documentRequests: boolean;
  approvals: boolean;
  reminders: boolean;
}

const PushNotificationService = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    leaveRequests: true,
    remoteRequests: true,
    documentRequests: true,
    approvals: true,
    reminders: false
  });
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationSupport();
    loadSettings();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscriptionStatus();
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToNotifications();
        toast({
          title: "Notifications enabled",
          description: "You'll now receive push notifications for HR updates"
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive"
      });
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // In a real app, you'd get this from your server
      const vapidPublicKey = 'your-vapid-public-key-here';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // Send subscription to your server
      await sendSubscriptionToServer(subscription);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    // In a real app, you'd send this to your backend
    console.log('Subscription to send to server:', subscription);
    
    // Example API call:
    // await fetch('/api/notifications/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription)
    // });
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        
        toast({
          title: "Notifications disabled",
          description: "You won't receive push notifications anymore"
        });
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive"
      });
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('HR Manager Pro Test', {
        body: 'This is a test notification from HR Manager Pro',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifications are not supported in your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notification Status</p>
            <p className="text-sm text-gray-600">
              {permission === 'granted' && isSubscribed && 'Active'}
              {permission === 'granted' && !isSubscribed && 'Permission granted, not subscribed'}
              {permission === 'denied' && 'Blocked'}
              {permission === 'default' && 'Not requested'}
            </p>
          </div>
          <Badge variant={permission === 'granted' && isSubscribed ? 'default' : 'secondary'}>
            {permission === 'granted' && isSubscribed ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {permission === 'granted' && isSubscribed ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        {permission === 'default' && (
          <Button onClick={requestPermission} className="w-full">
            Enable Push Notifications
          </Button>
        )}

        {permission === 'granted' && !isSubscribed && (
          <Button onClick={subscribeToNotifications} className="w-full">
            Subscribe to Notifications
          </Button>
        )}

        {permission === 'granted' && isSubscribed && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testNotification} variant="outline" className="flex-1">
                Test Notification
              </Button>
              <Button onClick={unsubscribeFromNotifications} variant="destructive" className="flex-1">
                Disable
              </Button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Notification Preferences</h4>
              <div className="space-y-3">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting(key as keyof NotificationSettings, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Notifications are blocked. Please enable them in your browser settings to receive updates.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationService;
