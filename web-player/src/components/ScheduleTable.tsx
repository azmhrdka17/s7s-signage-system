import { ScheduleRow } from '../types';

interface Props {
  scheduleData: ScheduleRow[];
  position: { x: number; y: number; w: number; h: number };
}

function ScheduleTable({ scheduleData, position }: Props) {
  if (scheduleData.length === 0) {
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
        No Schedule
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
        backgroundColor: '#fff',
        border: '3px solid #720808',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#720808', color: '#fff' }}>
            <th style={{ padding: 8, fontSize: 16, border: '1px solid #fff' }}>Poli</th>
            <th style={{ padding: 8, fontSize: 16, border: '1px solid #fff' }}>Dokter</th>
            <th style={{ padding: 8, fontSize: 16, border: '1px solid #fff' }}>Jam</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
              <td style={{ padding: 6, fontSize: 14, textAlign: 'center', border: '1px solid #ccc' }}>
                {row.poli}
              </td>
              <td style={{ padding: 6, fontSize: 14, textAlign: 'center', border: '1px solid #ccc' }}>
                {row.dokter}
              </td>
              <td style={{ padding: 6, fontSize: 14, textAlign: 'center', border: '1px solid #ccc' }}>
                {row.jam}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleTable;
