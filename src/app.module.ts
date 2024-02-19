import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBConfig } from './config/dg.config';
import { UsersModule } from './users/users.module';
import { LoggingMiddleware } from './logger';
import { AuthModule } from './auth/auth.module';
import { PatientProfileModule } from './patientprofile/patientprofile.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [DBConfig, UsersModule, AuthModule, PatientProfileModule, NotesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
