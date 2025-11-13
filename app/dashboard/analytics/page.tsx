"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMockData } from "@/lib/mock-data-service"
import { useEffect, useState } from "react"
import { ExportData } from "@/components/export-data"

// Mock analytics data
const oeeData = [
  { date: "Jan 20", oee: 85, availability: 92, performance: 88, quality: 95 },
  { date: "Jan 21", oee: 82, availability: 90, performance: 85, quality: 94 },
  { date: "Jan 22", oee: 88, availability: 95, performance: 90, quality: 96 },
  { date: "Jan 23", oee: 86, availability: 93, performance: 87, quality: 95 },
  { date: "Jan 24", oee: 84, availability: 91, performance: 86, quality: 93 },
  { date: "Jan 25", oee: 87, availability: 94, performance: 89, quality: 95 },
  { date: "Jan 26", oee: 89, availability: 96, performance: 91, quality: 97 },
  { date: "Jan 27", oee: 85, availability: 92, performance: 88, quality: 95 },
]

const downtimeData = [
  { reason: "Planned Maintenance", hours: 12, percentage: 35 },
  { reason: "Equipment Failure", hours: 8, percentage: 24 },
  { reason: "Material Shortage", hours: 6, percentage: 18 },
  { reason: "Changeover", hours: 5, percentage: 15 },
  { reason: "Other", hours: 3, percentage: 8 },
]

const productionData = [
  { shift: "Night (00-08)", planned: 450, actual: 425, efficiency: 94 },
  { shift: "Morning (08-16)", planned: 500, actual: 485, efficiency: 97 },
  { shift: "Evening (16-24)", planned: 480, actual: 445, efficiency: 93 },
]

const energyTrendData = [
  { month: "Jul", consumption: 8450, cost: 1690 },
  { month: "Aug", consumption: 8620, cost: 1724 },
  { month: "Sep", consumption: 8380, cost: 1676 },
  { month: "Oct", consumption: 8150, cost: 1630 },
  { month: "Nov", consumption: 7980, cost: 1596 },
  { month: "Dec", consumption: 7850, cost: 1570 },
  { month: "Jan", consumption: 7720, cost: 1544 },
]

const equipmentUtilizationData = [
  { equipment: "CNC-001", utilization: 92 },
  { equipment: "CNC-002", utilization: 78 },
  { equipment: "PRESS-001", utilization: 95 },
  { equipment: "CONV-001", utilization: 62 },
  { equipment: "WELD-001", utilization: 88 },
  { equipment: "LATHE-001", utilization: 91 },
]

const mtbfData = [
  { equipment: "CNC Machine #1", mtbf: 720, mttr: 2.5, reliability: 99.7 },
  { equipment: "CNC Machine #2", mtbf: 580, mttr: 3.2, reliability: 99.4 },
  { equipment: "Hydraulic Press #1", mtbf: 850, mttr: 2.0, reliability: 99.8 },
  { equipment: "Conveyor Belt #1", mtbf: 420, mttr: 4.5, reliability: 98.9 },
  { equipment: "Robotic Welder #1", mtbf: 680, mttr: 2.8, reliability: 99.6 },
]

const qualityData = [
  { date: "Jan 20", defectRate: 2.1, firstPassYield: 97.9 },
  { date: "Jan 21", defectRate: 2.3, firstPassYield: 97.7 },
  { date: "Jan 22", defectRate: 1.8, firstPassYield: 98.2 },
  { date: "Jan 23", defectRate: 2.0, firstPassYield: 98.0 },
  { date: "Jan 24", defectRate: 2.5, firstPassYield: 97.5 },
  { date: "Jan 25", defectRate: 1.9, firstPassYield: 98.1 },
  { date: "Jan 26", defectRate: 1.7, firstPassYield: 98.3 },
  { date: "Jan 27", defectRate: 2.1, firstPassYield: 97.9 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function AnalyticsPage() {
  const { equipment, alerts } = useMockData()
  const [predictions, setPredictions] = useState<any[]>([])
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate mock predictions and anomalies based on real equipment data
    generateAnalyticsData()
  }, [equipment, alerts])

  function generateAnalyticsData() {
    // Generate AI-powered predictions based on equipment health and sensor data
    const mockPredictions = equipment.map((eq: any) => {
      // AI logic: lower health = shorter RUL, higher vibration/temperature = shorter RUL
      const healthFactor = eq.health / 100
      const sensorFactor = (eq.temperature > 80 || eq.vibration > 4) ? 0.7 : 1.0
      const baseDays = Math.floor(Math.random() * 60) + 30 // 30-90 days base
      const predictedDays = Math.floor(baseDays * healthFactor * sensorFactor)

      return {
        id: `pred_${eq.id}`,
        equipment_id: eq.id,
        prediction_type: 'rul',
        predicted_value: Math.max(7, predictedDays), // Minimum 7 days
        confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
        prediction_date: new Date().toISOString(),
        risk_level: predictedDays < 30 ? 'high' : predictedDays < 60 ? 'medium' : 'low',
        ai_insights: generateAIInsights(eq, predictedDays),
      }
    })

    // Generate AI-detected anomalies based on sensor patterns
    const mockAnomalies = equipment.flatMap((eq: any) => {
      const anomalies = []

      // Temperature anomaly detection
      if (eq.temperature > 85) {
        anomalies.push({
          id: `anom_temp_${eq.id}`,
          anomaly_type: 'High Temperature',
          severity: eq.temperature > 90 ? 'critical' : 'warning',
          description: `Temperature spike detected: ${eq.temperature}°C (threshold: 85°C)`,
          detected_at: new Date().toISOString(),
          status: 'active',
          equipment_id: eq.id,
          ai_confidence: Math.floor(Math.random() * 10) + 90,
        })
      }

      // Vibration anomaly detection
      if (eq.vibration > 5.0) {
        anomalies.push({
          id: `anom_vib_${eq.id}`,
          anomaly_type: 'High Vibration',
          severity: eq.vibration > 6.0 ? 'critical' : 'warning',
          description: `Excessive vibration detected: ${eq.vibration} mm/s (threshold: 5.0 mm/s)`,
          detected_at: new Date().toISOString(),
          status: 'active',
          equipment_id: eq.id,
          ai_confidence: Math.floor(Math.random() * 10) + 90,
        })
      }

      // Energy consumption anomaly
      if (eq.energy > 55) {
        anomalies.push({
          id: `anom_energy_${eq.id}`,
          anomaly_type: 'High Energy Usage',
          severity: 'warning',
          description: `Abnormal energy consumption: ${eq.energy} kW (above normal range)`,
          detected_at: new Date().toISOString(),
          status: 'active',
          equipment_id: eq.id,
          ai_confidence: Math.floor(Math.random() * 10) + 85,
        })
      }

      return anomalies
    }).slice(0, 8) // Limit to 8 anomalies

    setPredictions(mockPredictions)
    setAnomalies(mockAnomalies)
    setLoading(false)
  }

  function generateAIInsights(equipment: any, predictedDays: number) {
    const insights = []

    if (equipment.temperature > 80) {
      insights.push("High operating temperature accelerating wear")
    }
    if (equipment.vibration > 4) {
      insights.push("Vibration patterns indicate bearing degradation")
    }
    if (equipment.health < 80) {
      insights.push("Overall health decline suggests multiple component issues")
    }
    if (predictedDays < 30) {
      insights.push("Urgent maintenance required within 30 days")
    }

    return insights.length > 0 ? insights : ["Normal operating conditions detected"]
  }

  // Calculate real metrics from equipment data
  const operationalCount = equipment.filter((e: any) => e.status === 'operational').length
  const warningCount = equipment.filter((e: any) => e.status === 'warning').length
  const criticalCount = equipment.filter((e: any) => e.status === 'critical').length

  const avgOEE = operationalCount > 0 ? Math.round((operationalCount / equipment.length) * 100) : 0
  const totalDowntime = alerts.filter((a: any) => a.type === 'downtime').length * 2 // Assume 2 hours per downtime alert
  const avgEnergy = equipment.reduce((sum: number, e: any) => sum + (e.latest_reading?.[0]?.energy_consumption || 0), 0) / equipment.length || 0
  const avgDefectRate = (alerts.filter((a: any) => a.type === 'quality').length / equipment.length * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance insights and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average OEE</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgOEE}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-chart-1" />
              <span className="text-chart-1">+3.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Downtime</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalDowntime}h</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-chart-1" />
              <span className="text-chart-1">-15%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Energy Usage</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgEnergy} kWh</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-chart-1" />
              <span className="text-chart-1">-8.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgDefectRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-chart-1" />
              <span className="text-chart-1">-0.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="oee" className="space-y-4">
        <TabsList>
          <TabsTrigger value="oee">OEE Analysis</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="oee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OEE Trend Analysis</CardTitle>
              <CardDescription>Overall Equipment Effectiveness over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  oee: { label: "OEE", color: "hsl(var(--chart-1))" },
                  availability: { label: "Availability", color: "hsl(var(--chart-2))" },
                  performance: { label: "Performance", color: "hsl(var(--chart-4))" },
                  quality: { label: "Quality", color: "hsl(var(--chart-5))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oeeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[75, 100]} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="oee" stroke="hsl(var(--chart-1))" strokeWidth={3} />
                    <Line type="monotone" dataKey="availability" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="performance" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                    <Line type="monotone" dataKey="quality" stroke="hsl(var(--chart-5))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Equipment uptime percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-2 mb-2">93.2%</div>
                <p className="text-sm text-muted-foreground mb-4">Target: 95%</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="h-3 rounded-full bg-chart-2" style={{ width: "93.2%" }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Speed efficiency rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-4 mb-2">88.1%</div>
                <p className="text-sm text-muted-foreground mb-4">Target: 90%</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="h-3 rounded-full bg-chart-4" style={{ width: "88.1%" }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality</CardTitle>
                <CardDescription>First pass yield rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-5 mb-2">95.4%</div>
                <p className="text-sm text-muted-foreground mb-4">Target: 98%</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="h-3 rounded-full bg-chart-5" style={{ width: "95.4%" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Downtime by Reason</CardTitle>
                <CardDescription>Distribution of downtime causes</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    hours: { label: "Hours", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={downtimeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="hours"
                      >
                        {downtimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Downtime Details</CardTitle>
                <CardDescription>Hours lost by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {downtimeData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="text-foreground">{item.reason}</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {item.hours}h ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: COLORS[index] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Utilization</CardTitle>
              <CardDescription>Utilization rate by equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  utilization: { label: "Utilization (%)", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="equipment" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="utilization" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production by Shift</CardTitle>
              <CardDescription>Planned vs actual production output</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  planned: { label: "Planned", color: "hsl(var(--chart-4))" },
                  actual: { label: "Actual", color: "hsl(var(--chart-1))" },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="shift" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="planned" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            {productionData.map((shift, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{shift.shift}</CardTitle>
                  <CardDescription>Production efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Planned</span>
                      <span className="font-semibold text-foreground">{shift.planned} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Actual</span>
                      <span className="font-semibold text-foreground">{shift.actual} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Efficiency</span>
                      <Badge
                        variant="outline"
                        className={
                          shift.efficiency >= 95
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : "bg-accent/10 text-accent border-accent/20"
                        }
                      >
                        {shift.efficiency}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics</CardTitle>
              <CardDescription>Defect rate and first pass yield trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  defectRate: { label: "Defect Rate (%)", color: "hsl(var(--chart-3))" },
                  firstPassYield: { label: "First Pass Yield (%)", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis yAxisId="left" domain={[0, 5]} className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" domain={[95, 100]} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="defectRate"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="firstPassYield"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reliability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mean Time Between Failures (MTBF)</CardTitle>
              <CardDescription>Equipment reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mtbfData.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">{item.equipment}</span>
                      <Badge
                        variant="outline"
                        className={
                          item.reliability >= 99.5
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : "bg-accent/10 text-accent border-accent/20"
                        }
                      >
                        {item.reliability}% reliable
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">MTBF</div>
                        <div className="text-lg font-semibold text-foreground">{item.mtbf}h</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">MTTR</div>
                        <div className="text-lg font-semibold text-foreground">{item.mttr}h</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reliability Score</CardTitle>
                <CardDescription>Overall equipment reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-chart-1 mb-4">99.5%</div>
                <p className="text-sm text-muted-foreground mb-4">Industry benchmark: 98%</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-chart-1" />
                  <span className="text-chart-1">+0.3% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Effectiveness</CardTitle>
                <CardDescription>Preventive vs corrective maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Preventive</span>
                      <span className="font-semibold text-foreground">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="h-3 rounded-full bg-chart-1" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Corrective</span>
                      <span className="font-semibold text-foreground">22%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="h-3 rounded-full bg-chart-3" style={{ width: "22%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Trend</CardTitle>
              <CardDescription>Monthly energy usage and cost analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  consumption: { label: "Consumption (kWh)", color: "hsl(var(--chart-2))" },
                  cost: { label: "Cost ($)", color: "hsl(var(--chart-1))" },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="consumption"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Savings</CardTitle>
                <CardDescription>Cost reduction vs baseline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-1 mb-2">$1,248</div>
                <p className="text-sm text-muted-foreground mb-4">Last 6 months</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-chart-1" />
                  <span className="text-chart-1">8.5% reduction</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Demand</CardTitle>
                <CardDescription>Maximum power consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-2">385 kW</div>
                <p className="text-sm text-muted-foreground mb-4">During production hours</p>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">12:00 - 16:00</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint</CardTitle>
                <CardDescription>CO₂ emissions reduction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-1 mb-2">-12.3%</div>
                <p className="text-sm text-muted-foreground mb-4">Compared to last year</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-chart-1" />
                  <span className="text-chart-1">2.4 tons CO₂ saved</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Anomalies</CardTitle>
                <CardDescription>Current AI-detected issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive mb-2">{anomalies.length}</div>
                <p className="text-sm text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RUL Predictions</CardTitle>
                <CardDescription>Equipment lifespan forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-1 mb-2">{predictions.length}</div>
                <p className="text-sm text-muted-foreground">Active predictions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Confidence</CardTitle>
                <CardDescription>Average prediction accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-chart-2 mb-2">
                  {predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictions.length) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Based on historical data</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Anomalies</CardTitle>
                    <CardDescription>Latest AI-detected issues</CardDescription>
                  </div>
                  <ExportData data={anomalies} filename="ai-anomalies" type="alerts" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {anomalies.slice(0, 5).map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {anomaly.severity}
                          </Badge>
                          <span className="font-medium text-sm">{anomaly.anomaly_type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{anomaly.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(anomaly.detected_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {anomalies.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No anomalies detected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Powered RUL Predictions</CardTitle>
                    <CardDescription>Advanced machine learning predictions with risk assessment</CardDescription>
                  </div>
                  <ExportData data={predictions} filename="ai-predictions" type="analytics" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-gradient-to-r from-card to-card/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            prediction.risk_level === 'high' ? 'bg-destructive' :
                            prediction.risk_level === 'medium' ? 'bg-accent' : 'bg-chart-1'
                          }`} />
                          <div>
                            <span className="font-semibold text-foreground">Equipment {prediction.equipment_id}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`${
                                prediction.risk_level === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                prediction.risk_level === 'medium' ? 'bg-accent/10 text-accent border-accent/20' :
                                'bg-chart-1/10 text-chart-1 border-chart-1/20'
                              }`}>
                                {prediction.confidence}% AI confidence
                              </Badge>
                              <Badge variant="secondary" className={`${
                                prediction.risk_level === 'high' ? 'bg-destructive/20 text-destructive' :
                                prediction.risk_level === 'medium' ? 'bg-accent/20 text-accent' :
                                'bg-chart-1/20 text-chart-1'
                              }`}>
                                {prediction.risk_level.toUpperCase()} RISK
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{prediction.predicted_value}</div>
                          <div className="text-xs text-muted-foreground">days remaining</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">AI Insights:</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {prediction.ai_insights.map((insight: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-chart-1 mt-1">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Predicted: {new Date(prediction.prediction_date).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {predictions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No AI predictions available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
