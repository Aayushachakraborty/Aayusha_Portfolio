import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-shell">
          <div className="sec-label">Error Boundary</div>
          <h1>Something broke. The model didn&apos;t survive contact.</h1>
          <a href="/" className="hbtn-main">Reload site</a>
        </main>
      );
    }

    return this.props.children;
  }
}
