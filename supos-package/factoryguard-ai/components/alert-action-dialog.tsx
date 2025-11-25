"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AlertActionDialogProps {
  alert: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAlertResolved?: () => void
}

export function AlertActionDialog({ alert, open, onOpenChange, onAlertResolved }: AlertActionDialogProps) {
  const { toast } = useToast()

  if (!alert) return null

  const handleResolve = async () => {
    console.log('[FactoryGuard] 🚨 ALERT RESOLUTION STARTED for:', alert.id)
    try {
      // Publish alert resolution to supOS-CE UNS
      console.log('[FactoryGuard] Publishing alert resolution to supOS-CE UNS:', alert.id)

      const { publishToUNSTopic, connectToSupOSMQTT } = await import('../lib/supos/client')

      // Ensure MQTT connection is established
      const connected = await connectToSupOSMQTT()
      if (!connected) {
        console.error('[FactoryGuard] MQTT connection failed for alert publishing')
        toast({
          title: "Connection Error",
          description: "Unable to connect to supOS-CE for alert sync. Alert resolved locally only.",
          variant: "destructive"
        })
      } else {
        const topic = `factory/alerts/${alert.equipment_id}/${alert.id}`
        const data = {
          id: alert.id,
          equipment_id: alert.equipment_id,
          sensor: alert.sensor,
          severity: alert.severity,
          type: alert.type,
          message: alert.message,
          value: alert.value,
          threshold: alert.threshold,
          resolved: true,
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'FactoryGuard User',
          source: 'factoryguard',
          timestamp: new Date().toISOString()
        }

        const success = publishToUNSTopic(topic, data)
        if (success) {
          console.log('[FactoryGuard] ✅ ALERT SYNCED TO SUPOS:', alert.id, '- Topic:', topic)
          console.log('[FactoryGuard] 📤 Published alert resolution data:', JSON.stringify(data, null, 2))
        } else {
          console.error('[FactoryGuard] ❌ Failed to publish alert resolution to supOS-CE')
        }
      }

      toast({
        title: "Alert Resolved & Synced",
        description: `Alert for ${alert.equipmentName} resolved and published back to supOS-CE via MQTT.`,
      })

      onOpenChange(false)
      onAlertResolved?.()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Alert Details
            <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>{alert.severity}</Badge>
          </DialogTitle>
          <DialogDescription>Review and take action on this alert</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Equipment</div>
            <div className="text-base font-semibold">{alert.equipment_id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Sensor</div>
            <div className="text-base">{alert.sensor}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Message</div>
            <div className="text-base">{alert.message}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Current Value</div>
              <div className="text-base font-semibold">{alert.value}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Threshold</div>
              <div className="text-base font-semibold">{alert.threshold}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date(alert.timestamp).toLocaleString()}
          </div>
          {alert.resolved && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <CheckCircle2 className="w-4 h-4 text-chart-1" />
              <div className="text-sm">
                <div className="font-medium text-chart-1">Resolved</div>
                <div className="text-muted-foreground">
                  By {alert.resolvedBy || 'User'} at {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!alert.resolved && (
            <Button onClick={() => { console.log('[FactoryGuard] 🔘 Resolve Alert button clicked'); handleResolve(); }} className="gap-2">
              <Wrench className="w-4 h-4" />
              Resolve Alert
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
