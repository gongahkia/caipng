import { useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LiveView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [detections, setDetections] = useState([]);
  const [avgByLabel, setAvgByLabel] = useState({});
  const [macros, setMacros] = useState(null);
  const [narrative, setNarrative] = useState('');
  const frameIntervalMs = 150; // ~6-7 fps target; adjustable up to ~100ms for ~10 fps
  const rollingWindow = useRef({}); // { label: { sum: number, count: number } }

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error('getUserMedia error', e);
      }
    })();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let timer;

    const tick = async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) {
          timer = setTimeout(tick, frameIntervalMs);
          return;
        }

        // Draw current frame to canvas
        const w = video.videoWidth;
        const h = video.videoHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);

        // Get base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        // Send to backend for analysis
        const resp = await fetch(`${API_URL}/live/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl })
        });
        const json = await resp.json();
        if (json?.success) {
          const dets = json.detections || [];
          setDetections(dets);

          // Update rolling averages by label
          dets.forEach(d => {
            const key = d.label || d.category || 'unknown';
            if (!rollingWindow.current[key]) rollingWindow.current[key] = { sum: 0, count: 0 };
            rollingWindow.current[key].sum += d.confidence;
            rollingWindow.current[key].count += 1;
          });

          const nextAvg = {};
          Object.entries(rollingWindow.current).forEach(([label, v]) => {
            nextAvg[label] = v.sum / Math.max(1, v.count);
          });
          setAvgByLabel(nextAvg);

          // Draw boxes
          ctx.strokeStyle = 'lime';
          ctx.lineWidth = 2;
          ctx.font = '14px sans-serif';
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          dets.forEach(d => {
            if (!d.box) return;
            const { x, y, width, height } = d.box;
            ctx.strokeRect(x, y, width, height);
            const label = d.label || d.category || 'unknown';
            const avg = nextAvg[label] || d.confidence || 0;
            const text = `${label} ${(avg * 100).toFixed(0)}%`;
            const tw = ctx.measureText(text).width + 8;
            const th = 18;
            ctx.fillRect(x, Math.max(0, y - th), tw, th);
            ctx.fillStyle = '#fff';
            ctx.fillText(text, x + 4, Math.max(12, y - 4));
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
          });
        }
      } catch (e) {
        console.error('analyze tick error', e);
      } finally {
        if (running) timer = setTimeout(tick, frameIntervalMs);
      }
    };

    timer = setTimeout(tick, frameIntervalMs);
    return () => clearTimeout(timer);
  }, [running]);

  const buildDerivedText = () => {
    const parts = Object.entries(avgByLabel)
      .sort((a, b) => b[1] - a[1])
      .map(([label, avg]) => `${label}: avgConfidence=${(avg * 100).toFixed(0)}%`);
    return `Detected items (rolling):\n${parts.join('\n')}\n`;
  };

  const estimateMacros = async () => {
    const derivedText = buildDerivedText();
    try {
      const resp = await fetch(`${API_URL}/live/macros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ derivedText })
      });
      const json = await resp.json();
      if (json?.success) {
        setMacros(json.macros || null);
        setNarrative(json.narrative || '');
      }
    } catch (e) {
      console.error('macros error', e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <button onClick={() => setRunning((v) => !v)}>{running ? 'Stop' : 'Start'} Live</button>
        <button onClick={estimateMacros} disabled={!running && Object.keys(avgByLabel).length === 0}>
          Estimate Macros
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 900 }}>
        <video ref={videoRef} style={{ width: '100%', border: '1px solid #ccc' }} muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Rolling averages:</strong>
        <pre style={{ background: '#f5f5f5', padding: 8 }}>
{JSON.stringify(avgByLabel, null, 2)}
        </pre>
      </div>

      {macros && (
        <div style={{ marginTop: 12 }}>
          <strong>Estimated Macros:</strong>
          <pre style={{ background: '#f5f5f5', padding: 8 }}>
{JSON.stringify(macros, null, 2)}
          </pre>
          {narrative && <p style={{ marginTop: 8 }}>{narrative}</p>}
        </div>
      )}
    </div>
  );
}
