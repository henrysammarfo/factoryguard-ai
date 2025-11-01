import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">FactoryGuard AI</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#roi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ROI Calculator
              </Link>
              <Link
                href="#integrations"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Integrations
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI-Powered Predictive Maintenance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Stop equipment failures before they happen
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            FactoryGuard AI uses machine learning to predict equipment failures up to 30 days in advance, reducing
            unplanned downtime by 40% and maintenance costs by 25%.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto">
                Start Free Trial
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 bg-transparent w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { value: "40%", label: "Reduction in downtime", sublabel: "Average across 200+ factories" },
            { value: "25%", label: "Lower maintenance costs", sublabel: "Year-over-year savings" },
            { value: "30 days", label: "Failure prediction window", sublabel: "Advanced warning system" },
            { value: "99.2%", label: "Prediction accuracy", sublabel: "Validated by IEEE research" },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Complete visibility into your operations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Real-time monitoring, predictive analytics, and actionable insights in one unified platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: () => (
                <svg className="w-10 h-10 text-chart-1 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Real-Time Equipment Monitoring",
              description:
                "Track temperature, vibration, pressure, and energy consumption across all equipment with sub-second latency.",
              color: "text-chart-1",
            },
            {
              icon: () => (
                <svg className="w-10 h-10 text-chart-2 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 003.8-.9h2.8a8.48 8.48 0 007.8 4.7l2.8-2.8A8.38 8.38 0 0021 11.5z"
                  />
                </svg>
              ),
              title: "Predictive Failure Analysis",
              description: "ML models analyze sensor data to predict failures 30 days in advance with 99.2% accuracy.",
              color: "text-chart-2",
            },
            {
              icon: () => (
                <svg className="w-10 h-10 text-destructive mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0019 14.168V8.632a2.025 2.025 0 00-1.405-1.795L15 5.25A2.025 2.025 0 0013.595 7.04L8.165 12.375a2.025 2.025 0 000 2.95l5.43 5.429A2.025 2.025 0 0015 17z"
                  />
                </svg>
              ),
              title: "Smart Alert System",
              description:
                "Severity-based alerts with recommended actions. Reduce alarm fatigue with intelligent filtering.",
              color: "text-destructive",
            },
            {
              icon: () => (
                <svg className="w-10 h-10 text-chart-1 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 19v6a2 2 0 002-2h-6a2 2 0 00-2-2V5a2 2 0 00-2 2h-6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "OEE Analytics Dashboard",
              description:
                "Track Overall Equipment Effectiveness, availability, performance, and quality metrics in real-time.",
              color: "text-chart-1",
            },
            {
              icon: () => (
                <svg className="w-10 h-10 text-chart-4 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Safety Compliance Tracking",
              description: "Automated safety checks and compliance reporting. Reduce incidents by 60%.",
              color: "text-chart-4",
            },
            {
              icon: () => (
                <svg className="w-10 h-10 text-chart-2 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Energy Optimization",
              description: "Identify energy waste and optimize consumption. Average 15% reduction in energy costs.",
              color: "text-chart-2",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
            >
              {feature.icon()}
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ROI Section */}
      <section id="roi" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Calculate your ROI</h2>
              <p className="text-muted-foreground text-balance">
                Most customers see positive ROI within 3-6 months of deployment
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Average Downtime Cost/Hour", value: "$5,000 - $50,000" },
                { label: "Downtime Reduction", value: "40%" },
                { label: "Payback Period", value: "3-6 months" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
                  <div className="text-2xl font-bold text-primary">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" className="gap-2">
                Get Custom ROI Analysis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Integrates with your existing systems</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Connect to PLCs, SCADA, MES, ERP, and IoT sensors via MQTT, OPC-UA, and REST APIs
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto items-center">
          {["supOS", "Siemens PLC", "Rockwell", "Schneider", "SAP", "Oracle", "MQTT", "OPC-UA"].map(
            (integration, i) => (
              <div key={i} className="text-center p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="text-lg font-semibold text-muted-foreground">{integration}</div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 md:p-16 text-center border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Ready to eliminate unplanned downtime?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Join 200+ factories using FactoryGuard AI to optimize operations and reduce costs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 text-base px-8 w-full sm:w-auto">
                Start Free Trial
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 bg-transparent w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">FactoryGuard AI</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered predictive maintenance for Industry 4.0</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#roi" className="hover:text-foreground transition-colors">
                    ROI Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 FactoryGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
