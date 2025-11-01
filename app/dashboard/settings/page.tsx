"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Database, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as React from "react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [pushNotifications, setPushNotifications] = React.useState(true)
  const [criticalAlerts, setCriticalAlerts] = React.useState(true)
  const [warningAlerts, setWarningAlerts] = React.useState(true)
  const [maintenanceReminders, setMaintenanceReminders] = React.useState(true)

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your FactoryGuard AI system preferences</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Manage how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="critical-alerts">Critical Alerts</Label>
                  <p className="text-sm text-muted-foreground">Immediate notifications for critical issues</p>
                </div>
                <Switch id="critical-alerts" checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="warning-alerts">Warning Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notifications for warning-level issues</p>
                </div>
                <Switch id="warning-alerts" checked={warningAlerts} onCheckedChange={setWarningAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-reminders">Maintenance Reminders</Label>
                  <p className="text-sm text-muted-foreground">Scheduled maintenance notifications</p>
                </div>
                <Switch
                  id="maintenance-reminders"
                  checked={maintenanceReminders}
                  onCheckedChange={setMaintenanceReminders}
                />
              </div>
              <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <CardTitle>Alert Thresholds</CardTitle>
              </div>
              <CardDescription>Configure sensor thresholds for alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temp-warning">Temperature Warning (°C)</Label>
                  <Input id="temp-warning" type="number" defaultValue="80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp-critical">Temperature Critical (°C)</Label>
                  <Input id="temp-critical" type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vib-warning">Vibration Warning (mm/s)</Label>
                  <Input id="vib-warning" type="number" step="0.1" defaultValue="4.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vib-critical">Vibration Critical (mm/s)</Label>
                  <Input id="vib-critical" type="number" step="0.1" defaultValue="5.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health-warning">Health Score Warning (%)</Label>
                  <Input id="health-warning" type="number" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="health-critical">Health Score Critical (%)</Label>
                  <Input id="health-critical" type="number" defaultValue="65" />
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Save Threshold Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <CardTitle>System Integrations</CardTitle>
              </div>
              <CardDescription>Connect to external systems and data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">supOS Platform</h4>
                    <p className="text-sm text-muted-foreground">Industrial IoT data collection</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">MQTT Broker</h4>
                    <p className="text-sm text-muted-foreground">Real-time sensor data streaming</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Hugging Face AI</h4>
                    <p className="text-sm text-muted-foreground">Predictive maintenance models</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Email Service</h4>
                    <p className="text-sm text-muted-foreground">Alert notifications via email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <CardTitle>System Configuration</CardTitle>
              </div>
              <CardDescription>General system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="update-interval">Data Update Interval</Label>
                <Select defaultValue="3">
                  <SelectTrigger id="update-interval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second</SelectItem>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="data-retention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveSettings}>Save System Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Security & Access</CardTitle>
              </div>
              <CardDescription>Manage security settings and user access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Manage User Permissions
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                API Keys & Tokens
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Audit Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
