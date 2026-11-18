import { useEffect, useState } from 'react';

interface Props {
  position: { x: number; y: number; w: number; h: number };
}

function DateTime({ position }: Props) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}, ${dateNum} ${month} ${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#FFD700' }}>
        {formatTime(dateTime)}
      </div>
      <div style={{ fontSize: 14, color: '#fff', marginTop: 5 }}>
        {formatDate(dateTime)}
      </div>
    </div>
  );
}

export default DateTime;
