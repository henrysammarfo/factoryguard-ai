"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddEquipmentDialog() {
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      // Mock equipment addition for demo
      const equipmentName = formData.get("name") as string

      setOpen(false)
      toast({
        title: "Equipment Added",
        description: `${equipmentName} has been successfully added to the system.`,
      })
    } catch (error) {
      console.error('Failed to add equipment:', error)
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Activity className="w-4 h-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>Add a new piece of equipment to the monitoring system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input id="name" name="name" placeholder="CNC Machine #3" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Equipment Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNC Milling">CNC Milling</SelectItem>
                    <SelectItem value="CNC Lathe">CNC Lathe</SelectItem>
                    <SelectItem value="Hydraulic Press">Hydraulic Press</SelectItem>
                    <SelectItem value="Conveyor System">Conveyor System</SelectItem>
                    <SelectItem value="Welding Robot">Welding Robot</SelectItem>
                    <SelectItem value="Assembly Robot">Assembly Robot</SelectItem>
                    <SelectItem value="Injection Molding">Injection Molding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input id="manufacturer" name="manufacturer" placeholder="Haas Automation" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input id="model" name="model" placeholder="VF-2SS" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input id="serialNumber" name="serialNumber" placeholder="HA-2025-001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installDate">Install Date *</Label>
                <Input id="installDate" name="installDate" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select name="location" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production Floor A">Production Floor A</SelectItem>
                  <SelectItem value="Production Floor B">Production Floor B</SelectItem>
                  <SelectItem value="Assembly Line 1">Assembly Line 1</SelectItem>
                  <SelectItem value="Assembly Line 2">Assembly Line 2</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Equipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
