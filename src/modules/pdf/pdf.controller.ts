import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { UserService } from '../user/services/user.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly userService: UserService,
  ) {}
  //get param year
  @Get()
  async getPDF(
    @Req() request: Request,
    @Res() res,
    @Query('year') year: string,
  ) {
    const token = request.headers['authorization'] as string;
    const user = await this.userService.getUserByToken(token);
    const buffer = await this.pdfService.getPDF2(user.id, parseInt(year, 10));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
