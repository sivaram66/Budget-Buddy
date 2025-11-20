import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ui/theme-provider";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Crown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSearchParams } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for personal use",
    price: "$0",
    period: "",
    features: [
      "Basic expense tracking",
      "Monthly reports",
      "Up to 100 transactions",
      "Email support",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro",
    description: "Perfect for active users",
    price: "$9.99",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited transactions",
      "AI-powered insights",
      "Priority support",
      "Custom categories",
    ],
  },
  {
    id: "pro-annual",
    name: "Pro (Annual)",
    description: "Save 20% with annual billing",
    price: "$95.88",
    period: "/year",
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new features",
    ],
  },
];

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("pro-monthly");

  // New: fetch and control transaction notification toggle from backend
  useEffect(() => {
    async function fetchPref() {
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
      try {
        const res = await axios.get(`${serverUrl}user/email-prefs`, { withCredentials: true });
        setEmailNotifications(res.data.transactionEmailsEnabled);
      } catch (error) {
        console.error("Could not fetch notification prefs", error);
      }
    }
    fetchPref();
  }, []);

  async function handleTransactionEmailToggle(newValue: boolean) {
    const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
    await axios.patch(
      `${serverUrl}user/email-prefs`,
      { transactionEmailsEnabled: newValue },
      { withCredentials: true }
    );
    setEmailNotifications(newValue);
    toast.success(
      newValue
        ? "Transaction notifications enabled!"
        : "Transaction notifications disabled."
    );
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully");
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    toast.success("Plan updated successfully");
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs
        defaultValue={searchParams.get("tab") || "account"}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="billing">Plan & Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" required />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Dark Mode</Label>
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------- NOTIFICATIONS TAB, Fully Updated ----------- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>
                Manage your email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your transactions
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleTransactionEmailToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and tips
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your profile visibility and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={profilePublic}
                  onCheckedChange={setProfilePublic}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Current Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/2024
                    </p>
                  </div>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Choose the plan that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPlan}
                onValueChange={handlePlanChange}
                className="grid gap-4"
              >
                {plans.map((plan) => (
                  <Label
                    key={plan.id}
                    htmlFor={plan.id}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{plan.name}</p>
                            {plan.id.startsWith("pro") && (
                              <Badge className="bg-primary">
                                <Crown className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {plan.price}
                          <span className="text-sm text-muted-foreground">
                            {plan.period}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ml-8 space-y-2">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
