import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ProfilesModule,
    AppointmentsModule,
    RecommendationsModule,
    NotesModule,
  ],
})
export class AppModule {}
