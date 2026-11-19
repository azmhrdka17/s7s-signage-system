import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import SignagePlayer from './components/SignagePlayer';
import { SignageConfig } from './types';

// Read from environment variables or use defaults
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = rawApiUrl.trim().replace(/\/+$/, '');
const CLIENT_ID = (import.meta.env.VITE_CLIENT_ID || 'PRAMITHA').trim();

function App() {
  const [config, setConfig] = useState<SignageConfig | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastQueueCall, setLastQueueCall] = useState<any>(null);

  useEffect(() => {
    // Load initial config from API
    fetch(`${API_URL}/api/signage/${CLIENT_ID}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.slice(0, 80)}`);
        }
        return res.json();
      })
      .then((result) => {
        const nextConfig = result?.data ?? result;
        setConfig(nextConfig);
        localStorage.setItem('signage_config', JSON.stringify(nextConfig));
      })
      .catch((err) => {
        console.error('Failed to load config:', err);
        const cached = localStorage.getItem('signage_config');
        if (cached) {
          setConfig(JSON.parse(cached));
        }
      });

    // Setup WebSocket connection
    const socketInstance = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ WebSocket connect_error:', err.message);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    // Listen for refresh events
    socketInstance.on(`refresh:${CLIENT_ID}`, (data) => {
      console.log('📡 Received refresh event', data);
      const nextConfig = data?.data ?? data;
      setConfig(nextConfig);
      localStorage.setItem('signage_config', JSON.stringify(nextConfig));
    });

    // Listen for queue call events
    socketInstance.on(`queue:${CLIENT_ID}`, (data) => {
      console.log('📡 Received queue call', data);
      setLastQueueCall(data);

      // Update config queueSlots immediately
      setConfig((prevConfig) => {
        if (!prevConfig) return prevConfig;

        const updatedSlots = prevConfig.queueSlots.map((slot) => {
          if (slot.slotNumber === data.slotNumber) {
            return {
              ...slot,
              loketName: data.loketName,
              currentNumber: data.currentNumber,
            };
          }
          return slot;
        });

        // If slot doesn't exist, add it
        const slotExists = updatedSlots.some((s) => s.slotNumber === data.slotNumber);
        if (!slotExists) {
          updatedSlots.push({
            id: Date.now(), // temporary ID
            clientId: CLIENT_ID,
            slotNumber: data.slotNumber,
            loketName: data.loketName,
            currentNumber: data.currentNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          updatedSlots.sort((a, b) => a.slotNumber - b.slotNumber);
        }

        const newConfig = {
          ...prevConfig,
          queueSlots: updatedSlots,
        };

        // Update cache
        localStorage.setItem('signage_config', JSON.stringify(newConfig));

        return newConfig;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  if (!config) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#000',
          color: '#fff',
          fontSize: '24px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <SignagePlayer
      config={config}
      lastQueueCall={lastQueueCall}
      apiUrl={API_URL}
      socket={socket}
    />
  );
}

export default App;