import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBConfig } from './config/dg.config';
import { UsersModule } from './users/users.module';
import { LoggingMiddleware } from './logger';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { NotesModule } from './notes/notes.module';
import { TasksModule } from './tasks/tasks.module';
import { TreatmentPlanModule } from './treatment-plan/treatment-plan.module';
import { ProgressAnalysisModule } from './progress-analysis/progress-analysis.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { MessagesModule } from './messages/messages.module';
import { MailboxModule } from './mailbox/mailbox.module';

@Module({
  imports: [
    DBConfig,
    UsersModule,
    AuthModule,
    PatientsModule,
    NotesModule,
    TasksModule,
    TreatmentPlanModule,
    ProgressAnalysisModule,
    ConsultationsModule,
    MessagesModule,
    MailboxModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
