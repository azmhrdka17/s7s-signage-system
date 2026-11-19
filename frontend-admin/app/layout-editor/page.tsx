'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const CLIENT_ID = 'PRAMITHA';

type BoxRect = { x: number; y: number; w: number; h: number };
type BoxKey = keyof BoxRect;

// Default layout
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
        if (data.content.layoutConfig && Object.keys(data.content.layoutConfig).length > 0) {
          setLayout({ ...DEFAULT_LAYOUT, ...data.content.layoutConfig });
        }
        setVideoMode(data.content.videoMode || 'video');
        setSlideDuration(data.content.slideDuration || 5);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load config:', err);
        setLoading(false);
      });
  }, []);

  const updateComponent = (component: LayoutKey, key: BoxKey, value: number) => {
    setLayout({
      ...layout,
      [component]: {
        ...layout[component],
        [key]: value,
      },
    });
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
  const activeComponent = selectedComponent ? layout[selectedComponent] : null;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🎨 Layout Editor - {CLIENT_ID}</h1>
      
      {/* Video Mode Settings */}
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
                onChange={(e) => setSlideDuration(parseInt(e.target.value) || 5)}
                style={{ width: 60, padding: 5 }}
              />
              {' '} detik
            </label>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Left: Component List */}
        <div style={{ flex: '0 0 200px', background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Komponen:</h3>
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

        {/* Center: Visual Preview */}
        <div style={{ flex: '1 1 600px', minWidth: 400, background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
          <h3 style={{ color: 'white', marginTop: 0, marginBottom: 10 }}>📺 Live Preview (1920×1080)</h3>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            background: '#000',
            border: '2px solid #444',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {/* Preview Container dengan scale */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}>
              <div style={{
                position: 'relative',
                width: 1920,
                height: 1080,
                transform: 'scale(0.4)',
                transformOrigin: 'top left',
              }}>
                {/* Render semua komponen */}
                {components.map((comp) => {
                  const pos = layout[comp];
                  const isSelected = selectedComponent === comp;
                  
                  // Color coding
                  let bgColor = 'rgba(100, 100, 255, 0.3)'; // Default: blue
                  if (comp.startsWith('Antrian')) bgColor = 'rgba(255, 165, 0, 0.4)'; // Orange for queue
                  if (comp === 'Video') bgColor = 'rgba(255, 50, 50, 0.4)'; // Red for video
                  if (comp === 'Slide') bgColor = 'rgba(100, 255, 100, 0.4)'; // Green for slide
                  if (comp === 'BackGround') bgColor = 'rgba(150, 150, 150, 0.2)'; // Gray for bg
                  
                  return (
                    <div
                      key={comp}
                      onClick={() => setSelectedComponent(comp)}
                      title={`${comp}: ${pos.x},${pos.y} - ${pos.w}×${pos.h}`}
                      style={{
                        position: 'absolute',
                        left: pos.x,
                        top: pos.y,
                        width: pos.w,
                        height: pos.h,
                        background: isSelected ? 'rgba(76, 175, 80, 0.6)' : bgColor,
                        border: isSelected ? '6px solid #4CAF50' : '3px solid rgba(255, 255, 255, 0.4)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 30px rgba(76, 175, 80, 0.8)' : '0 0 10px rgba(0,0,0,0.5)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          color: 'white',
                          fontSize: Math.max(20, pos.w / 15),
                          fontWeight: 'bold',
                          textShadow: '2px 2px 6px black',
                          userSelect: 'none',
                          marginBottom: 5,
                        }}>
                          {comp}
                        </div>
                        <div style={{
                          color: '#ddd',
                          fontSize: Math.max(12, pos.w / 30),
                          textShadow: '1px 1px 3px black',
                          userSelect: 'none',
                        }}>
                          {pos.w}×{pos.h}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p style={{ color: '#999', fontSize: 12, marginTop: 10, textAlign: 'center' }}>
            💡 Klik komponen di preview untuk edit
          </p>
        </div>

        {/* Right: Position Editor */}
        <div style={{ flex: '0 0 300px', background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #ddd' }}>
          {selectedComponent && activeComponent ? (
            <>
              <h3 style={{ marginTop: 0 }}>Edit: {selectedComponent}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 15 }}>
                {(['x', 'y', 'w', 'h'] as BoxKey[]).map((key) => (
                  <div key={key}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
                      {key === 'x' ? '↔️ X (Left)' : key === 'y' ? '↕️ Y (Top)' : key === 'w' ? '⬌ Width' : '⬍ Height'}: <span style={{ color: '#666' }}>{activeComponent[key]}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={key === 'x' || key === 'w' ? 1920 : 1080}
                      value={activeComponent[key]}
                      onChange={(e) => updateComponent(selectedComponent, key, parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <input
                      type="number"
                      value={activeComponent[key]}
                      onChange={(e) => updateComponent(selectedComponent, key, parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: 6,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        marginTop: 5,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: 15, background: '#e3f2fd', borderRadius: 5 }}>
                <strong>📍 Koordinat:</strong>
                <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}>
                  X: {activeComponent.x}px<br />
                  Y: {activeComponent.y}px<br />
                  Width: {activeComponent.w}px<br />
                  Height: {activeComponent.h}px
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
              <h3>← Pilih Komponen</h3>
              <p style={{ fontSize: 14 }}>Klik komponen di preview atau list</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 30, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
        <ul style={{ lineHeight: 1.8 }}>
          <li>📺 <strong>Preview real-time</strong> - Lihat posisi langsung</li>
          <li>🎯 <strong>Klik komponen</strong> di preview untuk edit</li>
          <li>🎨 <strong>Warna komponen:</strong> Orange = Antrian, Red = Video, Green = Slide</li>
          <li>📏 Base koordinat: <strong>1920×1080</strong> (Full HD)</li>
          <li>🔧 Player akan <strong>auto-scale</strong> ke resolusi monitor</li>
          <li>⚡ Perubahan langsung terlihat di player setelah save</li>
        </ul>
      </div>
    </div>
  );
}