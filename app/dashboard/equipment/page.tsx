"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  ThermometerIcon,
  ArrowRightIcon,
} from "@/components/icons"
import Link from "next/link"
import { useMockData } from "@/lib/mock-data-service"
import { AddEquipmentDialog } from "@/components/add-equipment-dialog"
import { ErrorBoundary } from "@/components/error-boundary"
import { EquipmentListSkeleton } from "@/components/loading-skeleton"
import { ExportData } from "@/components/export-data"
import * as React from "react"

export default function EquipmentPage() {
  const { equipment, isLoading } = useMockData()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [locationFilter, setLocationFilter] = React.useState("all")

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || eq.status === statusFilter
    const matchesLocation = locationFilter === "all" || eq.location === locationFilter
    return matchesSearch && matchesStatus && matchesLocation
  })

  if (isLoading) {
    return <EquipmentListSkeleton />
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipment</h1>
            <p className="text-muted-foreground">Monitor and manage all connected equipment</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportData data={equipment} filename="equipment-list" type="equipment" />
            <AddEquipmentDialog />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Production Floor A">Production Floor A</SelectItem>
                  <SelectItem value="Production Floor B">Production Floor B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <Link key={eq.id} href={`/dashboard/equipment/${eq.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{eq.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{eq.type}</p>
                    </div>
                    <Badge
                      variant={
                        eq.status === "operational" ? "default" : eq.status === "warning" ? "secondary" : "destructive"
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Health Score</span>
                      <span className="font-semibold text-foreground">{eq.health}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          eq.health >= 85 ? "bg-chart-1" : eq.health >= 70 ? "bg-accent" : "bg-destructive"
                        }`}
                        style={{ width: `${eq.health}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <ThermometerIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Temp</div>
                        <div className="font-medium text-foreground">{eq.temperature}°C</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Vibration</div>
                        <div className="font-medium text-foreground">{eq.vibration} mm/s</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{eq.location}</span>
                      {eq.alerts > 0 && (
                        <span className="text-destructive font-medium">
                          {eq.alerts} alert{eq.alerts > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full gap-2">
                    View Details
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <ActivityIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No equipment found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  )
}
