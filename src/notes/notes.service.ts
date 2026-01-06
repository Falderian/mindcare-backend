import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDTO } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return await this.prisma.note.create({
      data: { content: '' },
    });
  }

  async findAll() {
    return await this.prisma.note.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.note.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateNoteDto: Pick<CreateNoteDTO, 'content'>) {
    return await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.note.delete({
      where: { id },
    });
  }
}
