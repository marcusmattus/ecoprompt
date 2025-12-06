import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
          <div className="w-32 h-32 bg-[#FF5252] rounded-full border-4 border-[#0A0A0F] flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-4xl font-black uppercase bg-white px-4 py-2 border-4 border-[#0A0A0F] inline-block shadow-[8px_8px_0px_0px_#0A0A0F]">
            Something Went Wrong
          </h2>
          <div className="max-w-2xl bg-white p-6 border-4 border-[#0A0A0F] rounded-xl text-left">
            <p className="font-bold mb-2">Error:</p>
            <pre className="text-sm bg-[#F5F5F5] p-4 rounded overflow-auto">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-[#00E599] text-[#0A0A0F] border-4 border-[#0A0A0F] rounded-[24px] font-bold uppercase"
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
