"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Gauge,
  Zap,
  Calendar,
  TrendingUp,
  Settings,
  Download,
  ArrowLeft,
  XCircle,
} from "lucide-react"
import { Line, LineChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMockData } from "@/lib/mock-data-service"
import { useToast } from "@/hooks/use-toast"

const maintenanceHistory = [
  {
    date: "2025-01-25",
    type: "Scheduled Maintenance",
    description: "Routine inspection and lubrication",
    technician: "John Smith",
    duration: "2 hours",
    status: "completed",
  },
  {
    date: "2024-12-28",
    type: "Preventive Maintenance",
    description: "Replaced coolant system filters",
    technician: "Sarah Johnson",
    duration: "1.5 hours",
    status: "completed",
  },
  {
    date: "2024-11-30",
    type: "Scheduled Maintenance",
    description: "Routine inspection and calibration",
    technician: "Mike Davis",
    duration: "2 hours",
    status: "completed",
  },
]

const predictiveInsights = [
  {
    component: "Spindle Bearing",
    prediction: "Predicted failure in 28 days",
    confidence: 94,
    recommendation: "Schedule bearing replacement during next maintenance window",
    severity: "warning",
  },
  {
    component: "Coolant Pump",
    prediction: "Performance degradation detected",
    confidence: 87,
    recommendation: "Monitor pump pressure and consider replacement in 60 days",
    severity: "info",
  },
]

export default function EquipmentDetailPage() {
  const params = useParams()
  const equipmentId = params.id as string
  const { getEquipmentById, generateHistoricalData } = useMockData()
  const { toast } = useToast()
  const equipment = getEquipmentById(equipmentId)

  if (!equipment) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="p-8 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Equipment Not Found</h2>
          <p className="text-muted-foreground mb-4">The equipment you're looking for doesn't exist.</p>
          <Link href="/dashboard/equipment">
            <Button>Back to Equipment List</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const historicalData = generateHistoricalData(equipmentId, 24)
  const temperatureData = historicalData.slice(-6).map((d, i) => ({
    time: `${i * 4}:00`,
    value: Math.round(d.temperature * 10) / 10,
    threshold: 85,
  }))
  const vibrationData = historicalData.slice(-6).map((d, i) => ({
    time: `${i * 4}:00`,
    value: Math.round(d.vibration * 10) / 10,
    threshold: 5.0,
  }))
  const healthTrendData = historicalData.slice(-8).map((d, i) => ({
    date: `Day ${i + 1}`,
    health: Math.round(d.health),
  }))

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: `Equipment report for ${equipment.name} has been downloaded.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/equipment">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{equipment.name}</h1>
            <p className="text-muted-foreground">{equipment.type}</p>
          </div>
          <Badge
            variant={
              equipment.status === "operational"
                ? "default"
                : equipment.status === "warning"
                  ? "secondary"
                  : "destructive"
            }
            className={
              equipment.status === "operational"
                ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                : equipment.status === "warning"
                  ? "bg-accent/10 text-accent border-accent/20"
                  : ""
            }
          >
            {equipment.status === "operational" && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {equipment.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
            {equipment.status === "critical" && <XCircle className="w-3 h-3 mr-1" />}
            {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExportReport}>
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4" />
              Configure
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{equipment.health}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-chart-1" />
              <span className="text-chart-1">Live data</span> updating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{equipment.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Threshold: 85°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vibration</CardTitle>
            <Gauge className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{equipment.vibration} mm/s</div>
            <p className="text-xs text-muted-foreground mt-1">Threshold: 5.0 mm/s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{equipment.energy} kW</div>
            <p className="text-xs text-muted-foreground mt-1">Current consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="details">Equipment Details</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temperature (24h)</CardTitle>
                <CardDescription>Real-time temperature monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Temperature (°C)", color: "hsl(var(--chart-3))" },
                    threshold: { label: "Threshold", color: "hsl(var(--muted-foreground))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="threshold"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vibration (24h)</CardTitle>
                <CardDescription>Real-time vibration monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Vibration (mm/s)", color: "hsl(var(--chart-1))" },
                    threshold: { label: "Threshold", color: "hsl(var(--muted-foreground))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vibrationData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="threshold"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Score Trend (Recent)</CardTitle>
              <CardDescription>Equipment health over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  health: { label: "Health Score (%)", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[50, 100]} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="health" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>AI-powered failure predictions and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`w-5 h-5 ${insight.severity === "warning" ? "text-accent" : "text-chart-1"}`}
                        />
                        <span className="font-semibold text-foreground">{insight.component}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={insight.severity === "warning" ? "bg-accent/10 text-accent border-accent/20" : ""}
                      >
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2">{insight.prediction}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Recommendation:</span> {insight.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Failure Risk Analysis</CardTitle>
              <CardDescription>Component-level risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { component: "Spindle Bearing", risk: 35, status: "warning" },
                  { component: "Coolant Pump", risk: 22, status: "info" },
                  { component: "Drive Motor", risk: 8, status: "good" },
                  { component: "Control System", risk: 5, status: "good" },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.component}</span>
                      <span className="font-semibold text-foreground">{item.risk}% risk</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === "warning" ? "bg-accent" : item.status === "info" ? "bg-chart-1" : "bg-chart-1"
                        }`}
                        style={{ width: `${item.risk}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Upcoming and past maintenance activities</CardDescription>
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    toast({
                      title: "Feature Coming Soon",
                      description: "Maintenance scheduling will be available soon.",
                    })
                  }
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Maintenance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-primary/50 bg-primary/5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">Next Scheduled Maintenance</span>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-1">{equipment.nextMaintenance}</p>
                  <p className="text-xs text-muted-foreground">Routine inspection and lubrication</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Maintenance History</h4>
                  {maintenanceHistory.map((record, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold text-foreground text-sm">{record.type}</span>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </div>
                        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-2">{record.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Technician: {record.technician}</span>
                        <span>Duration: {record.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Information</CardTitle>
                <CardDescription>Basic equipment details and specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Equipment ID</span>
                    <span className="text-sm font-medium text-foreground">{equipment.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Manufacturer</span>
                    <span className="text-sm font-medium text-foreground">{equipment.manufacturer}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Model</span>
                    <span className="text-sm font-medium text-foreground">{equipment.model}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium text-foreground">{equipment.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Install Date</span>
                    <span className="text-sm font-medium text-foreground">{equipment.installDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Serial Number</span>
                    <span className="text-sm font-medium text-foreground">{equipment.serialNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Metrics</CardTitle>
                <CardDescription>Live sensor readings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="text-sm font-medium text-foreground">{equipment.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Vibration</span>
                    <span className="text-sm font-medium text-foreground">{equipment.vibration} mm/s</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Pressure</span>
                    <span className="text-sm font-medium text-foreground">{equipment.pressure} bar</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Energy Usage</span>
                    <span className="text-sm font-medium text-foreground">{equipment.energy} kW</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Health Score</span>
                    <span className="text-sm font-medium text-foreground">{equipment.health}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
