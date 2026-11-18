import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default client
  const client = await prisma.client.upsert({
    where: { id: 'PRAMITHA' },
    update: {},
    create: {
      id: 'PRAMITHA',
      description: 'SIGNAGE ANTRIAN',
      signageContent: {
        create: {
          videoUrls: '[]',
          slideUrls: '[]',
          runningText: 'Selamat Datang di Layanan Kami - Mohon Antri dengan Tertib',
          scheduleTable: JSON.stringify([
            { poli: 'Poli Umum', dokter: 'dr. Ahmad', jam: '08:00 - 12:00' },
            { poli: 'Poli Gigi', dokter: 'drg. Siti', jam: '13:00 - 16:00' },
            { poli: 'Poli Anak', dokter: 'dr. Budi, Sp.A', jam: '08:00 - 14:00' },
          ]),
          backgroundUrl: '',
        },
      },
      queueSlots: {
        create: [
          { slotNumber: 1, loketName: 'Loket 1', currentNumber: '' },
          { slotNumber: 2, loketName: 'Loket 2', currentNumber: '' },
          { slotNumber: 3, loketName: 'Loket 3', currentNumber: '' },
          { slotNumber: 4, loketName: 'Loket 4', currentNumber: '' },
          { slotNumber: 5, loketName: 'Loket 5', currentNumber: '' },
        ],
      },
    },
  });

  console.log('✅ Created client:', client.id);

  // Create default TV channels
  const channels = [
    { code: 195, name: 'TransTV' },
    { code: 243, name: 'Indosiar' },
    { code: 251, name: 'RCTI' },
    { code: 269, name: 'ANTV' },
    { code: 277, name: 'Trans7' },
    { code: 309, name: 'MetroTV' },
  ];

  for (const channel of channels) {
    await prisma.tvChannel.upsert({
      where: { code: channel.code },
      update: {},
      create: channel,
    });
  }

  console.log('✅ Created TV channels');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
