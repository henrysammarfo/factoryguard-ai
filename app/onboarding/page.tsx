"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2Icon } from "@/components/icons"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const steps = [
    {
      title: "Welcome to FactoryGuard AI",
      description: "Your intelligent predictive maintenance platform",
      content:
        "FactoryGuard AI helps you monitor equipment health, predict failures before they happen, and optimize your factory operations with AI-powered insights.",
    },
    {
      title: "Real-Time Monitoring",
      description: "Track all your equipment in one place",
      content:
        "Get instant visibility into temperature, vibration, pressure, and energy consumption across all your machines. Receive alerts when anomalies are detected.",
    },
    {
      title: "Predictive Analytics",
      description: "Prevent downtime before it happens",
      content:
        "Our AI models analyze sensor data to predict equipment failures days or weeks in advance, giving you time to schedule maintenance and avoid costly downtime.",
    },
    {
      title: "You're all set!",
      description: "Let's start monitoring your factory",
      content:
        "You can add your first equipment from the dashboard. We've loaded some demo data to help you get started.",
    },
  ]

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    } else {
      localStorage.setItem("factoryguard_onboarding_complete", "true")
      router.push("/dashboard")
    }
  }

  const handleSkip = () => {
    localStorage.setItem("factoryguard_onboarding_complete", "true")
    router.push("/dashboard")
  }

  const currentStep = steps[step - 1]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FactoryGuard AI</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step} of {steps.length}
            </span>
          </div>
          <CardTitle className="text-3xl">{currentStep.title}</CardTitle>
          <CardDescription className="text-lg">{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{currentStep.content}</p>

          {step === steps.length && (
            <div className="grid gap-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <span>Dashboard with real-time metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <span>Equipment monitoring and analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <span>AI-powered predictive maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <span>Alert management and notifications</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {Array.from({ length: steps.length }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${i < step ? "bg-blue-600" : "bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip tour
            </Button>
            <Button onClick={handleNext}>{step === steps.length ? "Go to Dashboard" : "Next"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
