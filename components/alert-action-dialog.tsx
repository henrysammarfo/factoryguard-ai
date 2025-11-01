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
import { CheckCircle2, Clock } from "lucide-react"
import { useMockData, type Alert } from "@/lib/mock-data-service"
import { useToast } from "@/hooks/use-toast"

interface AlertActionDialogProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertActionDialog({ alert, open, onOpenChange }: AlertActionDialogProps) {
  const { acknowledgeAlert } = useMockData()
  const { toast } = useToast()

  if (!alert) return null

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id)
    onOpenChange(false)
    toast({
      title: "Alert Acknowledged",
      description: `Alert for ${alert.equipmentName} has been acknowledged.`,
    })
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
            <div className="text-base font-semibold">{alert.equipmentName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Message</div>
            <div className="text-base">{alert.message}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Recommended Action</div>
            <div className="text-base">{alert.action}</div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date(alert.timestamp).toLocaleString()}
          </div>
          {alert.acknowledged && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <CheckCircle2 className="w-4 h-4 text-chart-1" />
              <div className="text-sm">
                <div className="font-medium text-chart-1">Acknowledged</div>
                <div className="text-muted-foreground">
                  By {alert.acknowledgedBy} at {alert.acknowledgedAt?.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!alert.acknowledged && (
            <Button onClick={handleAcknowledge} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Acknowledge Alert
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
