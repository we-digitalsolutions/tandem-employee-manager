
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from '@/context/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'admin';
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Form setup with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password);
    
    if (success) {
      // Redirect based on role
      if (role === 'employee') {
        navigate('/employee-portal');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hr-gray p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">HR Manager</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your {role === 'employee' ? 'employee portal' : 'admin dashboard'}
          </p>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {role === 'employee' ? 'Employee Login' : 'Admin Login'}
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the {role === 'employee' ? 'employee portal' : 'HR dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="your.email@company.com" 
                            type="email"
                            className="hr-login-email-input"
                            {...field} 
                          />
                        </FormControl>
                      </div>
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
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Enter your password" 
                            type={showPassword ? "text" : "password"}
                            className="hr-login-password-input"
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full hr-login-submit-button">
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            {role === 'employee' ? (
              <Button variant="link" className="px-0" onClick={() => navigate('/login')}>
                Are you an admin?
              </Button>
            ) : (
              <Button variant="link" className="px-0" onClick={() => navigate('/login?role=employee')}>
                Employee login
              </Button>
            )}
            <Button variant="link" className="px-0">
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
