export interface QueueSlot {
  id: number;
  clientId: string;
  slotNumber: number;
  loketName: string;
  currentNumber: string;
  updatedAt: string;
}

export interface ScheduleRow {
  poli: string;
  dokter: string;
  jam: string;
}

export interface LayoutConfig {
  BackGround?: { x: number; y: number; w: number; h: number };
  Antrian1?: { x: number; y: number; w: number; h: number };
  Antrian2?: { x: number; y: number; w: number; h: number };
  Antrian3?: { x: number; y: number; w: number; h: number };
  Antrian4?: { x: number; y: number; w: number; h: number };
  Antrian5?: { x: number; y: number; w: number; h: number };
  Video?: { x: number; y: number; w: number; h: number };
  Slide?: { x: number; y: number; w: number; h: number };
  Tabel?: { x: number; y: number; w: number; h: number };
  RText?: { x: number; y: number; w: number; h: number };
  DateTime?: { x: number; y: number; w: number; h: number };
}

export interface SignageConfig {
  client: {
    id: string;
    description: string;
  };
  content: {
    videoUrls: string[];
    slideUrls: string[];
    runningText: string;
    scheduleTable: ScheduleRow[];
    backgroundUrl: string;
    layoutConfig?: LayoutConfig;
    videoMode?: 'video' | 'slideshow';
    slideDuration?: number;
  };
  queueSlots: QueueSlot[];
}

export interface QueueCallEvent {
  slotNumber: number;
  loketName: string;
  currentNumber: string;
}
