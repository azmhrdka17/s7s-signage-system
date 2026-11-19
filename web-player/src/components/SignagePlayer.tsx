import { useEffect, useState, useRef } from 'react';
import { SignageConfig, QueueCallEvent } from '../types';
import QueueBox from './QueueBox';
import VideoPlayer from './VideoPlayer';
import SlideShow from './SlideShow';
import ScheduleTable from './ScheduleTable';
import RunningText from './RunningText';
import DateTime from './DateTime';
import { speakQueueNumber } from '../utils/tts';

interface Props {
  config: SignageConfig;
  lastQueueCall: QueueCallEvent | null;
  apiUrl: string;
}

// Template coordinates (1920x1080 base)
const LAYOUT = {
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

function SignagePlayer({ config, lastQueueCall, apiUrl }: Props) {
  const [scale, setScale] = useState(1);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge custom layout dengan default layout
  const LAYOUT = {
    BackGround: config.content.layoutConfig?.BackGround || { x: 0, y: 0, w: 1920, h: 1080 },
    Antrian1: config.content.layoutConfig?.Antrian1 || { x: 5, y: 9, w: 597, h: 190 },
    Antrian2: config.content.layoutConfig?.Antrian2 || { x: 5, y: 203, w: 597, h: 190 },
    Antrian3: config.content.layoutConfig?.Antrian3 || { x: 5, y: 397, w: 597, h: 190 },
    Antrian4: config.content.layoutConfig?.Antrian4 || { x: 5, y: 590, w: 597, h: 190 },
    Antrian5: config.content.layoutConfig?.Antrian5 || { x: 5, y: 784, w: 597, h: 190 },
    Video: config.content.layoutConfig?.Video || { x: 628, y: 155, w: 1274, h: 622 },
    Slide: config.content.layoutConfig?.Slide || { x: 625, y: 790, w: 640, h: 188 },
    Tabel: config.content.layoutConfig?.Tabel || { x: 1272, y: 790, w: 639, h: 188 },
    RText: config.content.layoutConfig?.RText || { x: 0, y: 1011, w: 1551, h: 67 },
    DateTime: config.content.layoutConfig?.DateTime || { x: 1562, y: 994, w: 347, h: 79 },
  };

  // Auto-scale to fit screen
  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Handle queue call animation and TTS
  useEffect(() => {
    if (lastQueueCall) {
      const { slotNumber, loketName, currentNumber } = lastQueueCall;
      
      // Highlight animation
      setHighlightedSlot(slotNumber);
      setTimeout(() => setHighlightedSlot(null), 5000);

      // Text-to-speech
      speakQueueNumber(currentNumber, loketName);
    }
  }, [lastQueueCall]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Background */}
        {config.content.backgroundUrl && (
          <img
            src={`${apiUrl}${config.content.backgroundUrl}`}
            alt="Background"
            style={{
              position: 'absolute',
              left: LAYOUT.BackGround.x,
              top: LAYOUT.BackGround.y,
              width: LAYOUT.BackGround.w,
              height: LAYOUT.BackGround.h,
              objectFit: 'cover',
            }}
          />
        )}

        {/* Queue Boxes */}
        {[1, 2, 3, 4, 5].map((slotNum) => {
          const slot = config.queueSlots.find((s) => s.slotNumber === slotNum);
          const layoutKey = `Antrian${slotNum}` as keyof typeof LAYOUT;
          const pos = LAYOUT[layoutKey];

          return (
            <QueueBox
              key={slotNum}
              slotNumber={slotNum}
              loketName={slot?.loketName || `Loket ${slotNum}`}
              currentNumber={slot?.currentNumber || ''}
              position={pos}
              isHighlighted={highlightedSlot === slotNum}
            />
          );
        })}

        {/* Video/Slideshow Area */}
        {config.content.videoMode === 'slideshow' ? (
          <SlideShow
            slides={config.content.videoUrls.map(url => `${apiUrl}${url}`)}
            position={LAYOUT.Video}
            duration={(config.content.slideDuration || 5) * 1000}
          />
        ) : (
          <VideoPlayer
            videos={config.content.videoUrls.map(url => `${apiUrl}${url}`)}
            position={LAYOUT.Video}
          />
        )}

        {/* Slide Show */}
        <SlideShow
          slides={config.content.slideUrls.map(url => `${apiUrl}${url}`)}
          position={LAYOUT.Slide}
        />

        {/* Schedule Table */}
        <ScheduleTable
          scheduleData={config.content.scheduleTable}
          position={LAYOUT.Tabel}
        />

        {/* Running Text */}
        <RunningText
          text={config.content.runningText}
          position={LAYOUT.RText}
        />

        {/* Date Time */}
        <DateTime position={LAYOUT.DateTime} />
      </div>
    </div>
  );
}

export default SignagePlayer;
