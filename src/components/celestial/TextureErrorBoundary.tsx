import { Component, type ReactNode } from "react";

interface TextureErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface TextureErrorBoundaryState {
  hasError: boolean;
}

export class TextureErrorBoundary extends Component<
  TextureErrorBoundaryProps,
  TextureErrorBoundaryState
> {
  state: TextureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): TextureErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
