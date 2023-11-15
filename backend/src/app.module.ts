import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import * as dotenv from 'dotenv';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// dotenv.config();

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
