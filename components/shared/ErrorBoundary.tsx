"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <h3 className="text-xl font-semibold">Algo salió mal</h3>
            <p className="text-muted-foreground max-w-sm">
              {this.state.error?.message ?? "Error inesperado"}
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Reintentar
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
