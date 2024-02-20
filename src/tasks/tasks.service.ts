import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private patientsService: PatientsService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const patient = await this.patientsService.findOne(createTaskDto.patientId);
    try {
      const newTask = await this.tasksRepository.save({ ...createTaskDto, patient });
      return newTask;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async findOne(id: number) {
    try {
      const note = await this.tasksRepository.findOneBy({ id });
      if (!note) throw new NotFoundException('Task not found');
      return note;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllOfPatient(id: number) {
    const patient = await this.patientsService.findOne(id);
    try {
      const tasks = await this.tasksRepository.find({ where: { patient } });
      return tasks;
    } catch (error) {
      throw new BadRequestException(error).message;
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.findOne(id);
      const updatedNote = await this.tasksRepository.save({ ...task, ...updateTaskDto });
      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const task = await this.findOne(id);
      await this.tasksRepository.remove(task);
      return { message: 'Note removed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
