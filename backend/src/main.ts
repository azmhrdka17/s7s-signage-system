import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS untuk akses dari laptop lain
  app.enableCors({
    origin: '*', // Izinkan semua origin (untuk development/LAN)
    credentials: true,
  });

  // Listen di 0.0.0.0 agar bisa diakses dari network lain
  await app.listen(3001, '0.0.0.0');
  console.log('🚀 Backend server running on http://0.0.0.0:3001');
}
bootstrap();
