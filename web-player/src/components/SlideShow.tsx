import { useEffect, useState } from 'react';

interface Props {
  slides: string[];
  position: { x: number; y: number; w: number; h: number };
  duration?: number; // Durasi dalam milliseconds
}

function SlideShow({ slides, position, duration = 5000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [slides.length, duration]);

  if (slides.length === 0) {
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.w,
          height: position.h,
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666',
          fontSize: 18,
          border: '2px solid #333',
          borderRadius: 8,
        }}
      >
        No Slides
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.w,
        height: position.h,
        overflow: 'hidden',
        borderRadius: 8,
        border: '2px solid #fff',
      }}
    >
      <img
        src={slides[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
}

export default SlideShow;
