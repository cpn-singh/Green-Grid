import React from 'react';
import Navbar from '../Navbar';
import { Button, Card } from './index';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GreenGrid UI caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080b09] text-white flex flex-col items-center justify-center p-6">
          <Navbar />
          <Card className="max-w-lg w-full p-8 text-center border-emerald-500/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-mono">
              ⚡
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2 font-display uppercase">
              Dashboard View Initialized
            </h2>
            <p className="text-xs text-[#91a399] leading-relaxed mb-6 font-sans">
              An unexpected display issue occurred while rendering this view. You can reload the page or return to the national radar map.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={this.handleReload} variant="outline" className="text-xs px-4 py-2">
                Reload View ↺
              </Button>
              <Button onClick={this.handleHome} variant="primary" className="text-xs px-4 py-2">
                Return to Grid Radar →
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
