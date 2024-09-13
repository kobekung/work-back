import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { MEMBER_STATUS_ENUM } from 'src/enum/member.status';
import { Member } from 'src/models/member.model';
import { Project } from 'src/models/project.model';
import { ProjectLog } from 'src/models/project_log.model';
import { ProjectUnit } from 'src/models/project_unit.model';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class PdfService {
  constructor(@InjectModel(Project) private repository: typeof Project) {}
  
  async getPDF2(userId: number, year: number): Promise<Buffer> {
    const currentYear = year - 543;
    const lastTwoDigits = year.toString().slice(-2);
    const currentMonth = new Date().getMonth();
    const startDate = new Date(currentYear - 1, 9, 1);
    const endDate = new Date(currentYear, 8, 30);
    const monthsForPdf = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const thaiMonth = monthsForPdf[currentMonth];
    const data = await this.repository.findAll({
      include: [
        {
          model: ProjectLog,
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
        {
          model: ProjectUnit,
        },
        {
          model: Member,
          as: 'members',
          where: {
            userId,
            status: MEMBER_STATUS_ENUM.ACTIVE,
          },
        },
      ],
    });

    const rows2 = await data.map((project, index) => {
      // Define the start and end dates
      const startDate = new Date(currentYear - 1, 9, 1); // 1st October 2023
      const endDate = new Date(currentYear, 8, 30); // 30th September 2024

      // Initialize an array to store the last percentage for each month
      let monthlyPercentages = new Array(12).fill('0%');

      // Iterate through the project logs
      project.logs.forEach((log) => {
        const logDate = new Date(log.createdAt);
        if (logDate >= startDate && logDate <= endDate) {
          const monthIndex =
            (logDate.getFullYear() - startDate.getFullYear()) * 12 +
            logDate.getMonth() -
            startDate.getMonth();
          monthlyPercentages[monthIndex] = log.percent + '%' || '0%';
        }
      });

      return {
        index: index + 1,
        name: project.name,
        unit: project.projectUnit.name,
        percent: monthlyPercentages as string[],
        remark: '',
      };
    });

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      //horizontal margin top and bottom 10 px
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        layout: 'landscape',
        margin: 10,
        font: 'fonts/THSarabun.ttf',
      });

      // Header
      doc.fontSize(16).text(`รายงานสรุปผลการปฏิบัติงาน ประจำเดือน ${thaiMonth} ${lastTwoDigits}`, {
        align: 'center',
      });

      doc.fontSize(12).text('หน่วย กพร.ศทส.สส.ทหาร', {
        align: 'center',
        margin: { top: 20, bottom: 20 },
      });

      function addTable() {
        // Set font size for table content
        doc.fontSize(10);

        // Calculate the total width of the table
        const tableWidth = 40 + 140 + 100 + 160 + 160 + 120;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const startX = (pageWidth - tableWidth) / 2 + doc.page.margins.left;

        // Draw the headers
        const headers = [
          { label: 'ลำดับ', width: 40, x: startX, height: 60 },
          { label: 'งานปฏิบัติราชการ', width: 140, x: startX + 40, height: 60 },
          { label: 'หน่วยเจ้าของระบบ', width: 100, x: startX + 180, height: 60 },
          { label: year-1, width: 160, x: startX + 280 },
          { label: year, width: 160, x: startX + 440 },
          {
            label: `สรุปการดำเนินงาน\nพ.ศ. ${lastTwoDigits}`,
            width: 120,
            x: startX + 600,
            height: 60,
          },
        ];

        const startY = 60;

        headers.forEach((header) => {
          doc.text(header.label, header.x, startY, {
            width: header.width,
            align: 'center',
          });
          doc
            .rect(
              header.x,
              startY - 10,
              header.width,
              header.height ? header.height : 20,
            )
            .stroke();
        });

        // Draw the quarters and months headers
        const quarters = [
          { label: 'ไตรมาสที่ 1', x: startX + 280 },
          { label: 'ไตรมาสที่ 2', x: startX + 360 },
          { label: 'ไตรมาสที่ 3', x: startX + 440 },
          { label: 'ไตรมาสที่ 4', x: startX + 520 },
        ];

        const months = [
          'ต.ค.',
          'พ.ย.',
          'ธ.ค.',
          'ม.ค.',
          'ก.พ.',
          'มี.ค.',
          'เม.ย.',
          'พ.ค.',
          'มิ.ย.',
          'ก.ค.',
          'ส.ค.',
          'ก.ย.',
        ];

        quarters.forEach((quarter, index) => {
          doc.text(quarter.label, quarter.x, startY + 20, {
            width: 80,
            align: 'center',
          });
          doc.rect(quarter.x, startY + 10, 80, 20).stroke();
        });

        for (let i = 0; i < 12; i++) {
          doc.text(months[i], startX + 280 + (i % 12) * 26.6, startY + 40, {
            width: 26.6,
            align: 'center',
          });
          doc.rect(startX + 280 + (i % 12) * 26.6, startY + 30, 26.6, 20).stroke();
        }

        // Add data rows with matching percentages

        let y = 120;
        rows2.forEach((row) => {
          const rowHeight = 80; // Height of each row
          // Draw the cells for each row
          console.log(row);
          const cols = [
            { content: row.index, width: 40, x: startX },
            { content: row.name, width: 140, x: startX + 40 },
            { content: row.unit, width: 100, x: startX + 180 },
          ];

          cols.forEach((col) => {
            doc.text(col.content, col.x, y, {
              width: col.width,
              align: 'center',
            });
            doc.rect(col.x, y - 10, col.width, rowHeight).stroke();
          });

          // Draw the percentages under the correct months
          for (let i = 0; i < 6; i++) {
            doc.text(row.percent[i] || '', startX + 280 + i * 26.6, y, {
              width: 26.6,
              align: 'center',
            });
            doc.rect(startX + 280 + i * 26.6, y - 10, 26.6, rowHeight).stroke();
          }

          for (let i = 0; i < 6; i++) {
            doc.text(row.percent[i + 6] || '', startX + 440 + i * 26.6, y, {
              width: 26.6,
              align: 'center',
            });
            doc.rect(startX + 440 + i * 26.6, y - 10, 26.6, rowHeight).stroke();
          }

          doc.text(row.remark, startX + 600, y, { width: 120 });
          doc.rect(startX + 600, y - 10, 120, rowHeight).stroke();

          y += rowHeight; // Move to the next row position
        });
      }

      // Call the function to add the table
      addTable();

      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}