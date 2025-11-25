"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Real Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            company: formData.company,
          },
        },
      })

      if (error) {
        setError(error.message)
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Store user info in localStorage
        localStorage.setItem(
          "factoryguard_user",
          JSON.stringify({
            id: data.user.id,
            email: formData.email,
            name: formData.name,
            company: formData.company,
            role: "admin",
            isNewUser: true,
            signupTime: new Date().toISOString(),
          }),
        )

        // Seed initial data for new user
        try {
          // Seed equipment data
          const equipmentData = [
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

          const alertsData = [
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

          // Store seeded data in localStorage for the new user
          localStorage.setItem("factoryguard_equipment", JSON.stringify(equipmentData))
          localStorage.setItem("factoryguard_alerts", JSON.stringify(alertsData))

          console.log('[FactoryGuard] Seeded initial data for new user')
        } catch (error) {
          console.warn('[FactoryGuard] Failed to seed initial data:', error)
        }

        // Auto-connect to supOS after account creation
        try {
          const suposResponse = await fetch('/api/supos/connect', {
            method: 'POST'
          })
          const suposData = await suposResponse.json()

          if (suposData.success) {
            console.log('[FactoryGuard] Auto-connected to supOS after signup')
          } else {
            console.warn('[FactoryGuard] Auto-connection to supOS failed:', suposData.message)
          }
        } catch (error) {
          console.warn('[FactoryGuard] Auto-connection to supOS failed:', error)
        }

        toast({
          title: "Account Created!",
          description: "Welcome to FactoryGuard AI! Connecting to supOS...",
        })

        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
      toast({
        title: "Error",
        description: err.message || "An error occurred during signup",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold">FactoryGuard AI</span>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Start monitoring your factory in minutes</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@factory.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Acme Manufacturing"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
