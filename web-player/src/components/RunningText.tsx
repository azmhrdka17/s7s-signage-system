import { useEffect, useState } from 'react';

interface Props {
  text: string;
  position: { x: number; y: number; w: number; h: number };
}

function RunningText({ text, position }: Props) {
  const [offset, setOffset] = useState(position.w);
  const textRef = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        // Reset ketika text sudah keluar dari layar (minus lebar text)
        if (prev < -1000) {
          return position.w;
        }
        return prev - 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [position.w]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.w,
        height: position.h,
        backgroundColor: '#720808',
        border: '3px solid #fff',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          whiteSpace: 'nowrap',
          fontSize: 36,
          fontWeight: 'bold',
          color: '#FFD700',
          transform: `translateX(${offset}px)`,
        }}
      >
        {text || 'Selamat Datang'}
      </div>
    </div>
  );
}

export default RunningText;
