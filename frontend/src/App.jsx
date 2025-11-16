// V2: Minimal single-page app with live webcam analysis and macros panel
import LiveView from './pages/LiveView';

function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: '0 0 12px' }}>cAI-png V2 (Live)</h1>
      <LiveView />
    </div>
  );
}

export default App;

