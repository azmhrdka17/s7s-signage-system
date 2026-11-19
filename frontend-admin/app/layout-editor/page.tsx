'use client';

import { useState, useEffect } from 'react';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://s7s-signage-system-production.up.railway.app'
).replace(/\/+$/, '');
const CLIENT_ID = 'PRAMITHA';

type BoxRect = { x: number; y: number; w: number; h: number };
type BoxKey = keyof BoxRect;

const DEFAULT_LAYOUT: Record<string, BoxRect> = {
  BackGround: { x: 0, y: 0, w: 1920, h: 1080 },
  Antrian1: { x: 5, y: 9, w: 597, h: 190 },
  Antrian2: { x: 5, y: 203, w: 597, h: 190 },
  Antrian3: { x: 5, y: 397, w: 597, h: 190 },
  Antrian4: { x: 5, y: 590, w: 597, h: 190 },
  Antrian5: { x: 5, y: 784, w: 597, h: 190 },
  Video: { x: 628, y: 155, w: 1274, h: 622 },
  Slide: { x: 625, y: 790, w: 640, h: 188 },
  Tabel: { x: 1272, y: 790, w: 639, h: 188 },
  RText: { x: 0, y: 1011, w: 1551, h: 67 },
  DateTime: { x: 1562, y: 994, w: 347, h: 79 },
};

type LayoutMap = typeof DEFAULT_LAYOUT;
type LayoutKey = keyof LayoutMap;

export default function LayoutEditor() {
  const [layout, setLayout] = useState<LayoutMap>(DEFAULT_LAYOUT);
  const [videoMode, setVideoMode] = useState<'video' | 'slideshow'>('video');
  const [slideDuration, setSlideDuration] = useState(5);
  const [selectedComponent, setSelectedComponent] = useState<LayoutKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing layout
  useEffect(() => {
    fetch(`${API_URL}/api/signage/${CLIENT_ID}`)
      .then((res) => res.json())
      .then((result) => {
        const data = result.data;
        if (data?.content?.layoutConfig && Object.keys(data.content.layoutConfig).length > 0) {
          setLayout({ ...DEFAULT_LAYOUT, ...data.content.layoutConfig });
        }
        setVideoMode(data?.content?.videoMode || 'video');
        setSlideDuration(data?.content?.slideDuration || 5);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load config:', err);
        setLoading(false);
      });
  }, []);

  const updateComponent = (component: LayoutKey, key: BoxKey, value: number) => {
    setLayout((prev) => ({
      ...prev,
      [component]: {
        ...prev[component],
        [key]: value,
      },
    }));
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/signage/${CLIENT_ID}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layoutConfig: layout,
          videoMode,
          slideDuration,
        }),
      });

      if (response.ok) {
        alert('✅ Layout berhasil disimpan!');
      } else {
        alert('❌ Gagal menyimpan layout');
      }
    } catch (error) {
      alert('❌ Error: ' + error);
    }
    setSaving(false);
  };

  const resetToDefault = () => {
    if (confirm('Reset ke layout default?')) {
      setLayout(DEFAULT_LAYOUT);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  const components = Object.keys(layout) as LayoutKey[];
  const activeBox: BoxRect | null = selectedComponent ? layout[selectedComponent] : null;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🎨 Layout Editor - {CLIENT_ID}</h1>

      <div style={{ marginBottom: 20, padding: 20, background: '#f0f0f0', borderRadius: 8 }}>
        <h3>Video Area Mode</h3>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            value="video"
            checked={videoMode === 'video'}
            onChange={(e) => setVideoMode(e.target.value as 'video')}
          />
          {' '}Video (MP4)
        </label>
        <label>
          <input
            type="radio"
            value="slideshow"
            checked={videoMode === 'slideshow'}
            onChange={(e) => setVideoMode(e.target.value as 'slideshow')}
          />
          {' '}Slideshow (Gambar berganti-ganti)
        </label>

        {videoMode === 'slideshow' && (
          <div style={{ marginTop: 10 }}>
            <label>
              Durasi per gambar: {' '}
              <input
                type="number"
                min="1"
                max="60"
                value={slideDuration}
                onChange={(e) => setSlideDuration(parseInt(e.target.value, 10) || 5)}
                style={{ width: 60, padding: 5 }}
              />
              {' '} detik
            </label>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Left: Component List */}
        <div style={{ flex: 1, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
          <h3>Pilih Komponen:</h3>
          {components.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedComponent(comp)}
              style={{
                display: 'block',
                width: '100%',
                padding: 10,
                margin: '5px 0',
                background: selectedComponent === comp ? '#4CAF50' : '#ddd',
                color: selectedComponent === comp ? 'white' : 'black',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: selectedComponent === comp ? 'bold' : 'normal',
              }}
            >
              {comp}
            </button>
          ))}
        </div>

        {/* Right: Position Editor */}
        <div style={{ flex: 2, background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #ddd' }}>
          {selectedComponent && activeBox ? (
            <>
              <h3>Edit Posisi: {selectedComponent}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                {(['x', 'y', 'w', 'h'] as BoxKey[]).map((key) => (
                  <div key={key}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
                      {key === 'x' ? 'X (Left)' : key === 'y' ? 'Y (Top)' : key === 'w' ? 'Width' : 'Height'}:
                    </label>
                    <input
                      type="number"
                      value={activeBox[key]}
                      onChange={(e) =>
                        updateComponent(selectedComponent, key, parseInt(e.target.value, 10) || 0)
                      }
                      style={{
                        width: '100%',
                        padding: 8,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        fontSize: 16,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={key === 'x' || key === 'w' ? 1920 : 1080}
                      value={activeBox[key]}
                      onChange={(e) =>
                        updateComponent(selectedComponent, key, parseInt(e.target.value, 10))
                      }
                      style={{ width: '100%', marginTop: 5 }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: 15, background: '#e3f2fd', borderRadius: 5 }}>
                <strong>Preview:</strong>
                <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 14 }}>
                  Position: ({activeBox.x}, {activeBox.y})<br />
                  Size: {activeBox.w} × {activeBox.h}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
              <h3>← Pilih komponen untuk edit</h3>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
        <button
          onClick={saveLayout}
          disabled={saving}
          style={{
            padding: '15px 30px',
            background: saving ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {saving ? 'Menyimpan...' : '💾 Simpan Layout'}
        </button>

        <button
          onClick={resetToDefault}
          style={{
            padding: '15px 30px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          🔄 Reset ke Default
        </button>

        <a
          href="/admin"
          style={{
            padding: '15px 30px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          ← Kembali ke Admin
        </a>
      </div>

      {/* Info */}
      <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 8 }}>
        <h4>ℹ️ Catatan:</h4>
        <ul>
          <li>Koordinat base: 1920×1080 (Full HD)</li>
          <li>X, Y = posisi dari kiri-atas</li>
          <li>W, H = lebar dan tinggi komponen</li>
          <li>Player akan auto-scale ke resolusi monitor</li>
          <li><strong>Video Mode:</strong> Pilih "Video" untuk .mp4, atau "Slideshow" untuk gambar</li>
          <li>Perubahan akan langsung terlihat di player setelah save</li>
        </ul>
      </div>
    </div>
  );
}