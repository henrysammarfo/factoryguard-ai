"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Thermometer,
  Gauge,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { AlertActionDialog } from "@/components/alert-action-dialog"
import { ErrorBoundary } from "@/components/error-boundary"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { ExportData } from "@/components/export-data"
import * as React from "react"

// Mock performance data
const performanceData = [
  { time: "00:00", oee: 85, availability: 92, performance: 88, quality: 95 },
  { time: "04:00", oee: 82, availability: 90, performance: 85, quality: 94 },
  { time: "08:00", oee: 88, availability: 95, performance: 90, quality: 96 },
  { time: "12:00", oee: 86, availability: 93, performance: 87, quality: 95 },
  { time: "16:00", oee: 84, availability: 91, performance: 86, quality: 93 },
  { time: "20:00", oee: 87, availability: 94, performance: 89, quality: 95 },
]

const energyData = [
  { hour: "00", consumption: 245 },
  { hour: "04", consumption: 198 },
  { hour: "08", consumption: 312 },
  { hour: "12", consumption: 385 },
  { hour: "16", consumption: 356 },
  { hour: "20", consumption: 289 },
]

const PerformanceChart = React.memo(function PerformanceChart() {
  return (
    <ChartContainer
      config={{
        oee: { label: "OEE", color: "hsl(var(--chart-1))" },
        availability: { label: "Availability", color: "hsl(var(--chart-2))" },
        performance: { label: "Performance", color: "hsl(var(--chart-4))" },
        quality: { label: "Quality", color: "hsl(var(--chart-5))" },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="oee" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="availability" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="performance" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="quality" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

const EnergyChart = React.memo(function EnergyChart() {
  return (
    <ChartContainer
      config={{
        consumption: { label: "Consumption (kWh)", color: "hsl(var(--chart-2))" },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={energyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="hour" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="consumption" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export default function DashboardPage() {
  const [equipment, setEquipment] = React.useState<any[]>([])
  const [alerts, setAlerts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedAlert, setSelectedAlert] = React.useState<any | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false)

  React.useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock equipment data for demo
      const mockEquipment = [
        {
          id: "motor-001",
          name: "Main Conveyor Motor",
          status: "operational",
          health: 92,
          temperature: 68,
          vibration: 2.1,
          alerts: 0
        },
        {
          id: "pump-002",
          name: "Hydraulic Pump",
          status: "warning",
          health: 78,
          temperature: 75,
          vibration: 3.8,
          alerts: 1
        },
        {
          id: "fan-003",
          name: "Cooling Fan",
          status: "operational",
          health: 95,
          temperature: 45,
          vibration: 1.2,
          alerts: 0
        },
        {
          id: "sensor-004",
          name: "Pressure Sensor",
          status: "critical",
          health: 45,
          temperature: 82,
          vibration: 0.5,
          alerts: 2
        }
      ]

      // Mock alerts data
      const mockAlerts = [
        {
          id: "alert-001",
          equipmentName: "Hydraulic Pump",
          severity: "warning",
          message: "High vibration detected on hydraulic pump",
          action: "Schedule maintenance inspection",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
          acknowledged: false
        },
        {
          id: "alert-002",
          equipmentName: "Pressure Sensor",
          severity: "critical",
          message: "Pressure sensor reading out of range",
          action: "Replace pressure sensor immediately",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
          acknowledged: false
        }
      ]

      setEquipment(mockEquipment)
      setAlerts(mockAlerts)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setIsLoading(false)
    }
  }

  const handleAlertResolved = () => {
    // Reload data after alert resolution
    loadDashboardData()
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const totalEquipment = equipment.length
  const operationalCount = equipment.filter((e) => e.status === "operational").length
  const warningCount = equipment.filter((e) => e.status === "warning").length
  const criticalCount = equipment.filter((e) => e.status === "critical").length
  const totalAlerts = alerts.filter((a) => !a.acknowledged).length
  const avgHealth =
    totalEquipment > 0 ? Math.round(equipment.reduce((sum, e) => sum + e.health, 0) / totalEquipment) : 0

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert)
    setAlertDialogOpen(true)
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Equipment Health</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgHealth}%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-chart-1" />
                <span className="text-chart-1">Live data</span> updating every 3s
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalAlerts}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-destructive">{criticalCount} critical</span>, {warningCount} warnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average OEE</CardTitle>
              <Gauge className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">85.5%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-chart-3" />
                <span className="text-chart-3">-1.2%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,785 kWh</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-chart-1" />
                <span className="text-chart-1">-8.3%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Status Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>Real-time monitoring of all connected equipment</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ExportData data={equipment} filename="equipment-status" type="equipment" />
                <Link href="/dashboard/equipment">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {equipment.slice(0, 4).map((eq) => (
                <Link key={eq.id} href={`/dashboard/equipment/${eq.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{eq.name}</CardTitle>
                          <CardDescription className="text-xs">{eq.id}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            eq.status === "operational"
                              ? "default"
                              : eq.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            eq.status === "operational"
                              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                              : eq.status === "warning"
                                ? "bg-accent/10 text-accent border-accent/20"
                                : ""
                          }
                        >
                          {eq.status === "operational" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {eq.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {eq.status === "critical" && <XCircle className="w-3 h-3 mr-1" />}
                          {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Health Score</span>
                        <span className="font-semibold text-foreground">{eq.health}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{eq.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{eq.vibration} mm/s</span>
                        </div>
                      </div>
                      {eq.alerts > 0 && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          <span>
                            {eq.alerts} active alert{eq.alerts > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>OEE Performance (24h)</CardTitle>
              <CardDescription>Overall Equipment Effectiveness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>

          {/* Energy Consumption */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption (24h)</CardTitle>
              <CardDescription>Power usage across all equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyChart />
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Recent warnings and critical notifications</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ExportData data={alerts.filter((a) => !a.acknowledged)} filename="active-alerts" type="alerts" />
                <Button variant="outline" size="sm">
                  View All Alerts
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts
                .filter((a) => !a.acknowledged)
                .slice(0, 5)
                .map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${alert.severity === "critical" ? "bg-destructive" : "bg-accent"}`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{alert.equipmentName}</span>
                          <Badge
                            variant={alert.severity === "critical" ? "destructive" : "secondary"}
                            className={alert.severity === "warning" ? "bg-accent/10 text-accent border-accent/20" : ""}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {Math.round((Date.now() - new Date(alert.timestamp).getTime()) / 60000)} min ago
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">Recommended action: {alert.action}</p>
                    </div>
                  </div>
                ))}
              {alerts.filter((a) => !a.acknowledged).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-chart-1" />
                  <p>No active alerts. All systems operational.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <AlertActionDialog alert={selectedAlert} open={alertDialogOpen} onOpenChange={setAlertDialogOpen} onAlertResolved={handleAlertResolved} />
      </div>
    </ErrorBoundary>
  )
}
