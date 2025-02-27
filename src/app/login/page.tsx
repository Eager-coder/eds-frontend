"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login with any credentials
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth state (in a real app, you'd store a token)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ email }));

      // Redirect to dashboard
      router.push("/");
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-10 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Login illustration"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>

          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="mb-8 flex justify-center">
              <Image
                src="/placeholder.svg?height=80&width=260"
                alt="Nazarbayev University"
                width={260}
                height={80}
                className="h-16 w-auto"
              />
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@nu.edu.kz"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <a href="#" className="hover:underline">
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
