import * as mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(process.env.MONGODB_URI),
  },
];
