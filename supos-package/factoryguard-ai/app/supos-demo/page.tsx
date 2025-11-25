"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Database,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Settings,
  Monitor,
  Network,
  Server,
  Wifi,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default function SupOSDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Server className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">supOS Community Edition</h1>
            <Badge variant="outline" className="text-sm">supos-ce-instance2.supos.app:8443</Badge>
          </div>
          <p className="text-xl text-gray-600">Industrial IoT Platform - FactoryGuard AI Integration Demo</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="default" className="bg-green-100 text-green-800">System Online</Badge>
            <Badge variant="secondary">FactoryGuard AI Connected</Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Live MQTT: mqtt://127.0.0.1:1883</Badge>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SourceFlow Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Network className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-xl">SourceFlow - Data Ingestion</CardTitle>
                </div>
                <CardDescription>
                  Connected industrial devices streaming real-time data to FactoryGuard AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-800">MQTT Broker</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm text-green-700">
                      <div>Broker: 127.0.0.1 (Demo MQTT)</div>
                      <div>Port: 1883 (MQTT)</div>
                      <div>Protocol: Standard MQTT</div>
                      <div>Status: Connected</div>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-800">UNS Topics</span>
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• factory/+/+/+/equipment/+</div>
                      <div>• factory/+/+/+/sensors/+</div>
                      <div>• factory/+/alerts/+</div>
                      <div className="font-medium">Messages/sec: 45</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-purple-800">Connected Devices</span>
                    <Badge variant="default">4 Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-sm">
                      <div className="font-medium text-purple-900">Motor-001</div>
                      <div className="text-purple-700">Temperature: 68°C</div>
                      <div className="text-purple-700">Vibration: 2.1 mm/s</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-purple-900">Pump-002</div>
                      <div className="text-purple-700">Pressure: 8.1 bar</div>
                      <div className="text-purple-700">Flow: 245 L/min</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-purple-900">Fan-003</div>
                      <div className="text-purple-700">RPM: 1800</div>
                      <div className="text-purple-700">Power: 312 kW</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-purple-900">Sensor-004</div>
                      <div className="text-purple-700">Status: Critical</div>
                      <div className="text-purple-700">Last Update: Live</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EventFlow Interface */}
            <Card className="border-green-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-xl">EventFlow - Real-time Processing</CardTitle>
                </div>
                <CardDescription>
                  Event streaming and processing pipeline feeding FactoryGuard AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50 text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">45</div>
                    <div className="text-sm text-green-700">Events/sec</div>
                  </div>
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 text-center">
                    <div className="text-2xl font-bold text-blue-800 mb-1">2.1ms</div>
                    <div className="text-sm text-blue-700">Avg Latency</div>
                  </div>
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 text-center">
                    <div className="text-2xl font-bold text-purple-800 mb-1">99.9%</div>
                    <div className="text-sm text-purple-700">Uptime</div>
                  </div>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-orange-800">Active Event Rules</span>
                    <Badge variant="secondary">3 Rules</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-900">Temperature Threshold Alert</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-900">Vibration Anomaly Detection</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-900">Pressure Drop Warning</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Status */}
          <div className="space-y-6">
            <Card className="border-indigo-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-indigo-600" />
                  <CardTitle>FactoryGuard AI Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Flow</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Bidirectional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Predictions</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alert Sync</span>
                    <Badge variant="default" className="bg-orange-100 text-orange-800">Enabled</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-800 mb-1">4</div>
                    <div className="text-sm text-indigo-700">Equipment Monitored</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">DBConnect - Data Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>PostgreSQL</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>TimescaleDB</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-center pt-2">
                  <div className="text-lg font-bold text-gray-800">2.3GB</div>
                  <div className="text-sm text-gray-600">Time-series Data</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-teal-900">Alert Resolved</div>
                      <div className="text-teal-700">Motor-001 vibration issue fixed</div>
                      <div className="text-xs text-teal-600">2 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">AI Prediction</div>
                      <div className="text-blue-700">Pump-002 maintenance in 28 days</div>
                      <div className="text-xs text-blue-600">5 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-900">New Equipment</div>
                      <div className="text-orange-700">Sensor-004 added to monitoring</div>
                      <div className="text-xs text-orange-600">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard/supos">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                FactoryGuard Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Main Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            This demo shows how FactoryGuard AI integrates with supOS-CE through SourceFlow and EventFlow interfaces
          </p>
        </div>
      </div>
    </div>
  )
}