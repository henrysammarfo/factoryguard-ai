"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ActivityIcon,
  ThermometerIcon,
  GaugeIcon,
  ZapIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "@/components/icons"
import { useMockData } from "@/lib/mock-data-service"
import { ErrorBoundary } from "@/components/error-boundary"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { ExportData } from "@/components/export-data"
import Link from "next/link"

export default function MonitoringPage() {
  const { equipment, isLoading } = useMockData()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Real-Time Monitoring</h1>
            <p className="text-muted-foreground">Live equipment status and sensor data across all facilities</p>
          </div>
          <ExportData data={equipment} filename="monitoring-data" type="equipment" />
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipment.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Connected devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Operational</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">
                {equipment.filter((e) => e.status === "operational").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Running normally</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {equipment.filter((e) => e.status === "warning").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {equipment.filter((e) => e.status === "critical").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Equipment Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Live Equipment Status</CardTitle>
            <CardDescription>Real-time sensor data updating every 3 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipment.map((eq) => {
                return (
                  <Link key={eq.id} href={`/dashboard/equipment/${eq.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{eq.name}</h3>
                            <p className="text-xs text-muted-foreground">{eq.location}</p>
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
                            {eq.status === "operational" && <CheckCircle2Icon className="w-3 h-3 mr-1" />}
                            {eq.status === "warning" && <AlertTriangleIcon className="w-3 h-3 mr-1" />}
                            {eq.status === "critical" && <XCircleIcon className="w-3 h-3 mr-1" />}
                            {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <ThermometerIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Temp</div>
                              <div className="text-sm font-semibold text-foreground">{eq.temperature}°C</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Vibration</div>
                              <div className="text-sm font-semibold text-foreground">{eq.vibration} mm/s</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <GaugeIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Pressure</div>
                              <div className="text-sm font-semibold text-foreground">{eq.pressure} bar</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ZapIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Energy</div>
                              <div className="text-sm font-semibold text-foreground">{eq.energy} kW</div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Health Score</span>
                            <span className="font-semibold text-foreground">{eq.health}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                eq.health >= 85 ? "bg-chart-1" : eq.health >= 70 ? "bg-accent" : "bg-destructive"
                              }`}
                              style={{ width: `${eq.health}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
