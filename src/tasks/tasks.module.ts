import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { PatientProfileModule } from '../patientprofile/patientprofile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), PatientProfileModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
