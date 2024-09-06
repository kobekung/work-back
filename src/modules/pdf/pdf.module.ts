import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { Project } from 'src/models/project.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PdfService } from './pdf.service';

@Module({
  imports: [SequelizeModule.forFeature([Project])],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
