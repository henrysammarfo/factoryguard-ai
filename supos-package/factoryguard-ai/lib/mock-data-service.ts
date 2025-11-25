"use client"

// Mock data service with real-time simulation
export interface Equipment {
  id: string
  name: string
  type: string
  status: "operational" | "warning" | "critical" | "offline"
  health: number
  temperature: number
  vibration: number
  pressure: number
  energy: number
  location: string
  alerts: number
  lastMaintenance: string
  nextMaintenance: string
  installDate: string
  manufacturer: string
  model: string
  serialNumber: string
}

export interface Alert {
  id: string
  equipmentId: string
  equipmentName: string
  severity: "critical" | "warning" | "info"
  message: string
  timestamp: Date
  action: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
}

export interface SensorReading {
  timestamp: Date
  temperature: number
  vibration: number
  pressure: number
  energy: number
  health: number
}

// Initial equipment data
const initialEquipment: Equipment[] = [
  {
    id: "CNC-001",
    name: "CNC Machine #1",
    type: "CNC Milling",
    status: "operational",
    health: 92,
    temperature: 68,
    vibration: 2.1,
    pressure: 6.5,
    energy: 45.2,
    location: "Production Floor A",
    alerts: 0,
    lastMaintenance: "2 days ago",
    nextMaintenance: "28 days",
    installDate: "2022-03-15",
    manufacturer: "Haas Automation",
    model: "VF-2SS",
    serialNumber: "HA-2022-001",
  },
  {
    id: "CNC-002",
    name: "CNC Machine #2",
    type: "CNC Milling",
    status: "warning",
    health: 78,
    temperature: 82,
    vibration: 4.8,
    pressure: 6.2,
    energy: 52.8,
    location: "Production Floor A",
    alerts: 2,
    lastMaintenance: "15 days ago",
    nextMaintenance: "15 days",
    installDate: "2021-11-20",
    manufacturer: "Haas Automation",
    model: "VF-2SS",
    serialNumber: "HA-2021-045",
  },
  {
    id: "PRESS-001",
    name: "Hydraulic Press #1",
    type: "Hydraulic Press",
    status: "operational",
    health: 95,
    temperature: 72,
    vibration: 1.8,
    pressure: 150.5,
    energy: 38.5,
    location: "Production Floor B",
    alerts: 0,
    lastMaintenance: "5 days ago",
    nextMaintenance: "25 days",
    installDate: "2020-06-10",
    manufacturer: "Schuler",
    model: "SMG 500",
    serialNumber: "SCH-2020-012",
  },
  {
    id: "CONV-001",
    name: "Conveyor Belt #1",
    type: "Conveyor System",
    status: "critical",
    health: 62,
    temperature: 95,
    vibration: 6.2,
    pressure: 0,
    energy: 28.3,
    location: "Production Floor A",
    alerts: 5,
    lastMaintenance: "30 days ago",
    nextMaintenance: "Overdue",
    installDate: "2019-01-05",
    manufacturer: "Dorner",
    model: "2200 Series",
    serialNumber: "DOR-2019-089",
  },
  {
    id: "WELD-001",
    name: "Robotic Welder #1",
    type: "Welding Robot",
    status: "operational",
    health: 88,
    temperature: 75,
    vibration: 2.5,
    pressure: 0,
    energy: 62.1,
    location: "Production Floor B",
    alerts: 0,
    lastMaintenance: "8 days ago",
    nextMaintenance: "22 days",
    installDate: "2021-09-12",
    manufacturer: "FANUC",
    model: "ARC Mate 100iD",
    serialNumber: "FAN-2021-034",
  },
  {
    id: "LATHE-001",
    name: "CNC Lathe #1",
    type: "CNC Lathe",
    status: "operational",
    health: 91,
    temperature: 70,
    vibration: 2.2,
    pressure: 5.8,
    energy: 41.7,
    location: "Production Floor A",
    alerts: 0,
    lastMaintenance: "3 days ago",
    nextMaintenance: "27 days",
    installDate: "2022-01-18",
    manufacturer: "Mazak",
    model: "Quick Turn 250",
    serialNumber: "MAZ-2022-007",
  },
]

// Initial alerts
const initialAlerts: Alert[] = [
  {
    id: "alert-001",
    equipmentId: "CONV-001",
    equipmentName: "Conveyor Belt #1",
    severity: "critical",
    message: "Temperature exceeds safe threshold (95°C)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    action: "Immediate inspection required",
    acknowledged: false,
  },
  {
    id: "alert-002",
    equipmentId: "CNC-002",
    equipmentName: "CNC Machine #2",
    severity: "warning",
    message: "Vibration levels elevated (4.8 mm/s)",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    action: "Schedule maintenance check",
    acknowledged: false,
  },
  {
    id: "alert-003",
    equipmentId: "CNC-002",
    equipmentName: "CNC Machine #2",
    severity: "warning",
    message: "Predicted bearing failure in 15 days",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    action: "Order replacement parts",
    acknowledged: false,
  },
  {
    id: "alert-004",
    equipmentId: "CONV-001",
    equipmentName: "Conveyor Belt #1",
    severity: "critical",
    message: "Maintenance overdue by 5 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: "Schedule immediate maintenance",
    acknowledged: false,
  },
  {
    id: "alert-005",
    equipmentId: "CONV-001",
    equipmentName: "Conveyor Belt #1",
    severity: "warning",
    message: "Belt tension below optimal range",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    action: "Adjust belt tension",
    acknowledged: false,
  },
]

class MockDataService {
  private equipment: Equipment[] = []
  private alerts: Alert[] = []
  private listeners: Set<(data: { equipment: Equipment[]; alerts: Alert[] }) => void> = new Set()
  private intervalId: NodeJS.Timeout | null = null

  constructor() {
    this.loadFromStorage()
    if (this.equipment.length === 0) {
      this.equipment = [...initialEquipment]
      this.alerts = [...initialAlerts]
      this.saveToStorage()
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return
    try {
      const equipmentData = localStorage.getItem("factoryguard_equipment")
      const alertsData = localStorage.getItem("factoryguard_alerts")
      if (equipmentData) this.equipment = JSON.parse(equipmentData)
      if (alertsData) {
        this.alerts = JSON.parse(alertsData).map((a: Alert) => ({
          ...a,
          timestamp: new Date(a.timestamp),
          acknowledgedAt: a.acknowledgedAt ? new Date(a.acknowledgedAt) : undefined,
        }))
      }
    } catch (e) {
      console.error("[v0] Failed to load from storage:", e)
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("factoryguard_equipment", JSON.stringify(this.equipment))
      localStorage.setItem("factoryguard_alerts", JSON.stringify(this.alerts))
    } catch (e) {
      console.error("[v0] Failed to save to storage:", e)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener({ equipment: [...this.equipment], alerts: [...this.alerts] })
    })
  }

  // Simulate real-time data updates
  private simulateDataUpdate() {
    this.equipment = this.equipment.map((eq) => {
      // Random fluctuations
      const tempChange = (Math.random() - 0.5) * 2
      const vibChange = (Math.random() - 0.5) * 0.3
      const healthChange = (Math.random() - 0.5) * 0.5

      const newTemp = Math.max(60, Math.min(100, eq.temperature + tempChange))
      const newVib = Math.max(1, Math.min(8, eq.vibration + vibChange))
      const newHealth = Math.max(50, Math.min(100, eq.health + healthChange))

      // Update status based on metrics
      let newStatus = eq.status
      if (newHealth < 70 || newTemp > 90 || newVib > 5.5) {
        newStatus = "critical"
      } else if (newHealth < 80 || newTemp > 80 || newVib > 4) {
        newStatus = "warning"
      } else {
        newStatus = "operational"
      }

      return {
        ...eq,
        temperature: Math.round(newTemp * 10) / 10,
        vibration: Math.round(newVib * 10) / 10,
        health: Math.round(newHealth),
        status: newStatus,
        energy: Math.round((30 + Math.random() * 40) * 10) / 10,
      }
    })

    this.saveToStorage()
    this.notify()
  }

  startRealTimeUpdates() {
    if (this.intervalId) return
    this.intervalId = setInterval(() => {
      this.simulateDataUpdate()
    }, 3000) // Update every 3 seconds
  }

  stopRealTimeUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  subscribe(listener: (data: { equipment: Equipment[]; alerts: Alert[] }) => void) {
    this.listeners.add(listener)
    listener({ equipment: [...this.equipment], alerts: [...this.alerts] })
    return () => {
      this.listeners.delete(listener)
    }
  }

  getEquipment(): Equipment[] {
    return [...this.equipment]
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find((eq) => eq.id === id)
  }

  getAlerts(): Alert[] {
    return [...this.alerts]
  }

  acknowledgeAlert(alertId: string, userName = "System User") {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      alert.acknowledgedBy = userName
      alert.acknowledgedAt = new Date()
      this.saveToStorage()
      this.notify()
    }
  }

  addEquipment(equipment: Omit<Equipment, "id" | "alerts">) {
    const newEquipment: Equipment = {
      ...equipment,
      id: `${equipment.type.split(" ")[0].toUpperCase()}-${String(this.equipment.length + 1).padStart(3, "0")}`,
      alerts: 0,
    }
    this.equipment.push(newEquipment)
    this.saveToStorage()
    this.notify()
    return newEquipment
  }

  updateEquipment(id: string, updates: Partial<Equipment>) {
    const index = this.equipment.findIndex((eq) => eq.id === id)
    if (index !== -1) {
      this.equipment[index] = { ...this.equipment[index], ...updates }
      this.saveToStorage()
      this.notify()
    }
  }

  deleteEquipment(id: string) {
    this.equipment = this.equipment.filter((eq) => eq.id !== id)
    this.alerts = this.alerts.filter((alert) => alert.equipmentId !== id)
    this.saveToStorage()
    this.notify()
  }

  // Generate historical sensor data for charts
  generateHistoricalData(equipmentId: string, hours = 24): SensorReading[] {
    const equipment = this.getEquipmentById(equipmentId)
    if (!equipment) return []

    const data: SensorReading[] = []
    const now = Date.now()
    const interval = (hours * 60 * 60 * 1000) / 50 // 50 data points

    for (let i = 50; i >= 0; i--) {
      const timestamp = new Date(now - i * interval)
      const variance = Math.sin(i / 5) * 5 + (Math.random() - 0.5) * 3

      data.push({
        timestamp,
        temperature: Math.max(60, Math.min(100, equipment.temperature + variance)),
        vibration: Math.max(1, Math.min(8, equipment.vibration + (Math.random() - 0.5) * 0.5)),
        pressure: equipment.pressure + (Math.random() - 0.5) * 2,
        energy: equipment.energy + (Math.random() - 0.5) * 10,
        health: Math.max(50, Math.min(100, equipment.health + (Math.random() - 0.5) * 5)),
      })
    }

    return data
  }
}

// Singleton instance
export const mockDataService = new MockDataService()

// React hook for using the service
export function useMockData() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<{ equipment: Equipment[]; alerts: Alert[] }>({
    equipment: mockDataService.getEquipment(),
    alerts: mockDataService.getAlerts(),
  })

  React.useEffect(() => {
    const unsubscribe = mockDataService.subscribe(setData)
    mockDataService.startRealTimeUpdates()

    const timer = setTimeout(() => setIsLoading(false), 500)

    return () => {
      unsubscribe()
      mockDataService.stopRealTimeUpdates()
      clearTimeout(timer)
    }
  }, [])

  if (typeof window === "undefined") {
    return {
      equipment: [],
      alerts: [],
      isLoading: true,
      acknowledgeAlert: () => {},
      addEquipment: () => ({}) as Equipment,
      updateEquipment: () => {},
      deleteEquipment: () => {},
      getEquipmentById: () => undefined,
      generateHistoricalData: () => [],
    }
  }

  return {
    equipment: data.equipment,
    alerts: data.alerts,
    isLoading,
    acknowledgeAlert: mockDataService.acknowledgeAlert.bind(mockDataService),
    addEquipment: mockDataService.addEquipment.bind(mockDataService),
    updateEquipment: mockDataService.updateEquipment.bind(mockDataService),
    deleteEquipment: mockDataService.deleteEquipment.bind(mockDataService),
    getEquipmentById: mockDataService.getEquipmentById.bind(mockDataService),
    generateHistoricalData: mockDataService.generateHistoricalData.bind(mockDataService),
  }
}

// Need React import for the hook
import * as React from "react"
