import {
  Brain,
  Check,
  CreditCard,
  LineChart,
  PiggyBank,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/ui/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic expense tracking",
      "Monthly reports",
      "Up to 100 transactions",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "Best for personal finance",
    features: [
      "Everything in Free",
      "Unlimited transactions",
      "AI-powered insights",
      "Custom categories",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom integration",
      "Dedicated account manager",
      "SLA support",
      "Team collaboration",
    ],
  },
];

function LandingPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-buddy-theme">
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">BudgetBuddy</span>
            </div>
            <ModeToggle />
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smart Expense Tracking with AI
              <br />
              Powered by Docker & Jenkins
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Let artificial intelligence categorize your expenses automatically
              while you focus on what matters most - your financial goals.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  Get Started <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
              {/* <Button size="lg" variant="outline">
                Learn More
              </Button> */}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Smart Features for Smart Budgeting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Categorization"
              description="Our advanced AI automatically categorizes your expenses with high accuracy, saving you time and effort."
            />
            <FeatureCard
              icon={LineChart}
              title="Intelligent Insights"
              description="Get personalized spending insights and recommendations based on your financial patterns."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Budget Forecasting"
              description="Predict future expenses and plan your budget with AI-driven forecasting technology."
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-24 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Choose the plan that best fits your needs
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.popular ? "border-primary shadow-lg" : ""
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                    Most Popular
                  </span>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/login">
                    <Button className="w-full mt-6">
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Integration Section */}
        <section className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">
                  Powered by Advanced AI
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our sophisticated machine learning models understand your
                  spending patterns and automatically categorize transactions
                  with incredible accuracy. No more manual entry or
                  categorization needed.
                </p>
                <Link to="/login">
                  <Button className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Try Auto-Categorization
                  </Button>
                </Link>
              </div>
              <div className="flex-1 relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary rounded-full flex items-center justify-center">
                  <Brain className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Financial Management?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who are already saving time and money with
              BudgetBuddy's AI-powered expense tracking.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Your Free Trial <Sparkles className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-6 w-6 text-primary" />
                <span className="font-semibold">BudgetBuddy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 BudgetBuddy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default LandingPage;

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
