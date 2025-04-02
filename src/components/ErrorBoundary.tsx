import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'react-feather';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  background-color: #1a1e27;
  color: #eceff4;
  text-align: center;
  box-sizing: border-box;
`;

const ErrorIcon = styled.div`
  color: #ff4d4f;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  max-width: 600px;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: rgba(255, 77, 79, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 77, 79, 0.3);
  font-family: monospace;
  white-space: pre-wrap;
  text-align: left;
  overflow: auto;
  max-height: 200px;
`;

const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a0ca3;
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorContainer>
          <ErrorIcon>
            <AlertTriangle size={64} />
          </ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.stack || this.state.error?.message || 'Unknown error'}
          </ErrorMessage>
          <ResetButton onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </ResetButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
