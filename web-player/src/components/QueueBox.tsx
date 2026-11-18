import { CSSProperties } from 'react';

interface Props {
  slotNumber: number;
  loketName: string;
  currentNumber: string;
  position: { x: number; y: number; w: number; h: number };
  isHighlighted: boolean;
}

function QueueBox({ slotNumber, loketName, currentNumber, position, isHighlighted }: Props) {
  const containerStyle: CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: position.w,
    height: position.h,
    backgroundColor: isHighlighted ? '#FFD700' : '#720808',
    border: '3px solid #fff',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    transition: 'all 0.3s ease',
    animation: isHighlighted ? 'pulse 1s infinite' : 'none',
  };

  const loketStyle: CSSProperties = {
    fontSize: 32,
    fontWeight: 'bold',
    color: isHighlighted ? '#000' : '#fff',
    marginBottom: 10,
  };

  const numberStyle: CSSProperties = {
    fontSize: 64,
    fontWeight: 'bold',
    color: isHighlighted ? '#000' : '#FFD700',
    letterSpacing: 4,
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px #FFD700; }
            50% { transform: scale(1.05); box-shadow: 0 0 40px #FFD700; }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={loketStyle}>{loketName}</div>
        <div style={numberStyle}>{currentNumber || '-'}</div>
      </div>
    </>
  );
}

export default QueueBox;
