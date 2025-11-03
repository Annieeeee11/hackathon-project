"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import { supabase, validateSupabaseConfig } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconLoader2, IconBrain, IconBook, IconTrophy, IconMessageCircle } from "@tabler/icons-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate Supabase configuration before making requests
      const configValidation = validateSupabaseConfig();
      if (!configValidation.valid) {
        throw new Error(configValidation.error || 'Supabase is not configured properly.');
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          router.push("/dashboard");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          if (data.user.email_confirmed_at) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            router.push("/dashboard");
          } else {
            setError("Please check your email and click the confirmation link before signing in.");
          }
        }
      }
    } catch (err) {
      let errorMessage = "An error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Provide more helpful error messages
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 
            'Failed to connect to Supabase. Please check:\n' +
            '• Your internet connection\n' +
            '• Supabase credentials in .env.local\n' +
            '• Your Supabase project is active\n\n' +
            'See ENVIRONMENT_SETUP.md for setup instructions.';
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <header className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-2">
          <IconBrain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AI Learning Assistant</h1>
        </div>
        <ModeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <IconBrain className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to AI Learning Assistant
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to continue your learning journey" 
                : "Create your account to start learning with AI"
              }
            </p>
          </div>


          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
              <IconBook className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">AI Courses</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
              <IconMessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">AI Chat</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
              <IconTrophy className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
              <IconBrain className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Assessments</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm whitespace-pre-line">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
