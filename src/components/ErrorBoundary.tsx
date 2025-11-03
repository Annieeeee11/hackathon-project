"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isEnvError = error?.message?.includes("environment variable") || 
                         error?.message?.includes("Missing required");

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-destructive/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <IconAlertCircle className="w-6 h-6 text-destructive" />
              <h1 className="text-2xl font-bold text-foreground">Application Error</h1>
            </div>
            
            {isEnvError ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The application is missing required environment variables. Please configure them in your Vercel project settings.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">Required Environment Variables:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>OPENAI_API_KEY</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">How to fix:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Navigate to Settings → Environment Variables</li>
                    <li>Add the required variables</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  An unexpected error occurred. Please check the browser console for more details.
                </p>
                {error && (
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-mono text-destructive break-all">
                      {error.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1"
              >
                <IconRefresh className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

