import Home from './pages/Home';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h1>DocuMind</h1>
          </div>
          <p className="tagline">AI-Powered Document Intelligence</p>
        </div>
      </header>

      <main className="app-main">
        <Home />
      </main>

      <footer className="app-footer">
        <p>Built with Spring Boot, FastAPI, and React</p>
      </footer>
    </div>
  );
}

export default App;
