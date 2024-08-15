import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async getPDF(@Res() res) {
    const buffer = await this.pdfService.getPDF();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get("2")
  async getPDF2(@Res() res) {
    const buffer = await this.pdfService.getPDF2();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
