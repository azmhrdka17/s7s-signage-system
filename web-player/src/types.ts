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
  };
  queueSlots: QueueSlot[];
}

export interface QueueCallEvent {
  slotNumber: number;
  loketName: string;
  currentNumber: string;
}
