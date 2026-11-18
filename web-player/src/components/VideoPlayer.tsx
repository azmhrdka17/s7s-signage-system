import { useEffect, useRef, useState } from 'react';

interface Props {
  videos: string[];
  position: { x: number; y: number; w: number; h: number };
}

function VideoPlayer({ videos, position }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!videoRef.current || videos.length === 0) return;

    const video = videoRef.current;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [videos.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  }, [currentIndex]);

  if (videos.length === 0) {
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.w,
          height: position.h,
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666',
          fontSize: 24,
        }}
      >
        No Video
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.w,
        height: position.h,
        objectFit: 'cover',
      }}
      autoPlay
      muted
      loop
    >
      <source src={videos[currentIndex]} type="video/mp4" />
    </video>
  );
}

export default VideoPlayer;
