
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"consumer" | "provider">("consumer");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: activeTab === "consumer" ? "consumer@example.com" : "provider@example.com",
      password: "password123",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login(values.email, values.password, activeTab);
    navigate("/");
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "consumer" | "provider");
    form.reset({
      email: value === "consumer" ? "consumer@example.com" : "provider@example.com",
      password: "password123",
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="flex flex-col items-center mb-6">
          <Hotel className="h-10 w-10 text-hotel-primary mb-2" />
          <h1 className="text-2xl font-bold">Sign in to HOTELQUICK</h1>
          <p className="text-gray-500 mt-2 text-center">
            Enter your credentials to access your account
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Tabs
            defaultValue="consumer"
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="consumer">Consumer</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-hotel-primary hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>
                  Demo accounts are pre-filled for convenience.
                </p>
                <p className="mt-1">
                  In a real implementation, you would need to register.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
