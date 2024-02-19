import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBConfig } from './config/dg.config';
import { UsersModule } from './users/users.module';
import { LoggingMiddleware } from './logger';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { NotesModule } from './notes/notes.module';
import { TasksModule } from './tasks/tasks.module';
import { TreatmentPlanModule } from './treatment-plan/treatment-plan.module';

@Module({
  imports: [DBConfig, UsersModule, AuthModule, PatientsModule, NotesModule, TasksModule, TreatmentPlanModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
