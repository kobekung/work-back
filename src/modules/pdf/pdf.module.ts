import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { Project } from 'src/models/project.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PdfService } from './pdf.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Project]),UserModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
