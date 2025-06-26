
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, 
  Mail, 
  MessageSquare, 
  Calendar, 
  FileText,
  Users,
  Settings,
  Link2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ExternalIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: MessageSquare,
      status: 'connected',
      enabled: true,
      config: { webhookUrl: 'https://hooks.slack.com/...' }
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Email notifications and calendar sync',
      icon: Mail,
      status: 'available',
      enabled: false,
      config: {}
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync leave requests and meetings',
      icon: Calendar,
      status: 'available',
      enabled: false,
      config: {}
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 1000+ apps',
      icon: Link2,
      status: 'available',
      enabled: false,
      config: {}
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Electronic document signing',
      icon: FileText,
      status: 'available',
      enabled: false,
      config: {}
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Talent',
      description: 'Recruitment and talent management',
      icon: Users,
      status: 'available',
      enabled: false,
      config: {}
    }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
    toast.success('Integration settings updated');
  };

  const connectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'connected' }
          : integration
      )
    );
    toast.success('Integration connected successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'available':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      default:
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">External Integrations</h1>
          <p className="text-gray-600">Connect with external tools and services</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Browse More
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <integration.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  disabled={integration.status !== 'connected'}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{integration.description}</p>
              
              {integration.status === 'connected' ? (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => connectIntegration(integration.id)}
                >
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Webhook Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Set up custom webhooks to integrate with any external service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input 
                placeholder="https://your-service.com/webhook" 
                type="url"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Leave Request Submitted</option>
                <option>Employee Onboarded</option>
                <option>Performance Review Due</option>
                <option>Attendance Alert</option>
              </select>
            </div>
          </div>
          <Button className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Add Webhook
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Generate API keys for custom integrations and third-party applications.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <Input 
                value="hrm_*********************" 
                readOnly 
                className="font-mono text-sm"
              />
              <Button variant="outline">
                Regenerate
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last generated: 2 days ago • Used 127 times this month
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalIntegrations;
