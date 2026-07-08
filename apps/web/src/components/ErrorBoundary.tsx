import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary caught an uncaught render exception]:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-slate-950 p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="text-6xl" role="img" aria-label="Error sign">⚠️</div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400">Something went wrong</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An unexpected error occurred. Please refresh the page.
            </p>
            <p className="text-xs font-mono bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-left break-words">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
