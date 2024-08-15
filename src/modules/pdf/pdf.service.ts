import { Injectable } from '@nestjs/common';
import { height } from 'pdfkit/js/page';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class PdfService {
  async getPDF(): Promise<Buffer> {
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
      doc.fontSize(16).text('รายงานสรุปผลการปฏิบัติงาน ประจำเดือน พ.ค. 67', {
        align: 'center',
      });

      doc.fontSize(12).text('หน่วย กพร.ศทส.สส.ทหาร', {
        align: 'center',
      });

      const table = {
        title: 'Table title',
        subtitle: 'Table subtitle',
        headers: [
          { label: 'ลำดับ', width: 50 },
          { label: 'งานปฏิบัติราชการ', width: 150 },
          { label: 'หน่วยเข้าของระบบ', width: 100 },
          { label: '2566\nไตรมาสที่ 1\n ต.ค. พ.ย. ธ.ค.', width: 80 },
          { label: 'ไตรมาสที่ 2\n ม.ค. ก.พ. มี.ค.', width: 80 },
          { label: '2567\nไตรมาสที่ 3\n ต.ค. พ.ย. ธ.ค.', width: 80 },
          { label: 'ไตรมาสที่ 4\n ม.ค. ก.พ. มี.ค.', width: 80 },
          { label: 'สรุปการดำเนินงาน\nพ.ศ. 67', width: 120 },
        ],
        rows: [
          ['1', 'Example task', 'System Unit', '✓', '✓', '✓', '✓', '✓'],
          ['1', 'Example task', 'System Unit', '✓', '✓', '✓', '✓', '✓'],
        ],
      };

      doc.table(table, {
        prepareHeader: () => {
          doc.font('fonts/THSarabun.ttf').fontSize(14);
        },
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font('fonts/THSarabun.ttf').fontSize(8);
        },
      });

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

  async getPDF2(): Promise<Buffer> {
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
      doc.fontSize(16).text('รายงานสรุปผลการปฏิบัติงาน ประจำเดือน พ.ค. 67', {
        align: 'center',
      });

      doc.fontSize(12).text('หน่วย กพร.ศทส.สส.ทหาร', {
        align: 'center',
      });
      //   function addTable() {
      //     // doc.font('Helvetica').fontSize(10);

      //     // Draw the headers
      //     doc.text('ลำดับ', 20, 40, { width: 40, align: 'center' });
      //     doc.text('งานปฏิบัติราชการ', 60, 40, { width: 140, align: 'center' });
      //     doc.text('หน่วยเข้าของระบบ', 200, 40, { width: 100, align: 'center' });

      //     // Headers for the years 2566 and 2567
      //     doc.text('2566', 250, 40, { width: 160, align: 'center' });
      //     doc.text('2567', 460, 40, { width: 160, align: 'center' });
      //     doc.text('สรุปการดำเนินงาน\nพ.ศ. 67', 620, 40, {
      //       width: 120,
      //       align: 'center',
      //     });

      //     // Quarter headers
      //     doc.text('ไตรมาสที่ 1', 300, 60, { width: 80, align: 'center' });
      //     doc.text('ไตรมาสที่ 2', 380, 60, { width: 80, align: 'center' });
      //     doc.text('ไตรมาสที่ 3', 460, 60, { width: 80, align: 'center' });
      //     doc.text('ไตรมาสที่ 4', 540, 60, { width: 80, align: 'center' });

      //     // Months headers
      //     const months = [
      //       'ต.ค.',
      //       'พ.ย.',
      //       'ธ.ค.',
      //       'ม.ค.',
      //       'ก.พ.',
      //       'มี.ค.',
      //       'เม.ย.',
      //       'พ.ค.',
      //       'มิ.ย.',
      //       'ก.ค.',
      //       'ส.ค.',
      //       'ก.ย.',
      //     ];
      //     for (let i = 0; i < 12; i++) {
      //       doc.text(months[i], 300 + (i % 12) * 26.6, 80, {
      //         width: 26.6,
      //         align: 'center',
      //       });
      //     }

      //     // Add data rows with matching percentages
      //     const rows = [
      //       {
      //         index: '2.4',
      //         task: 'งานซื้อพร้อมติดตั้งและพัฒนาปรับเปลี่ยน\nระบบจัดการเอกสารอิเล็กทรอนิกส์\n(วงเงิน 4,280,000.-บาท)',
      //         unit: 'ศทส.ทหาร',
      //         percents: ['5%', '10%', '15%', '', '', '70%'],
      //         summary:
      //           'เปิดซองประกวดราคา\nเรียบร้อยแล้ว\nบริษัท ไทคิสวิก จำกัด\nวงเงิน 4,280,000.-บาท',
      //       },
      //       {
      //         index: '2.5',
      //         task: 'งานบำรุงรักษาระบบบริหารงานสารบรรณ\nตามโครงการพัฒนาโครงสร้างพื้นฐาน\nด้านเทคโนโลยีสารสนเทศ ประจำปีงบประมาณ\nพ.ศ. 2567 (วงเงิน 6,500,000.-บาท)',
      //         unit: 'สน.ทหาร',
      //         percents: ['5%', '10%', '15%', '', '', '65%'],
      //         summary: 'อยู่ระหว่างการขออนุมัติ\nจัดซื้อจัดจ้าง',
      //       },
      //     ];

      //     let y = 100;
      //     rows.forEach((row) => {
      //       doc.text(row.index, 20, y, { width: 40, align: 'center' });
      //       doc.text(row.task, 60, y, { width: 140 });
      //       doc.text(row.unit, 200, y, { width: 100, align: 'center' });

      //       // Distribute percentages under the correct months
      //       for (let i = 0; i < 6; i++) {
      //         doc.text(row.percents[i] || '', 300 + i * 26.6, y, {
      //           width: 26.6,
      //           align: 'center',
      //         });
      //       }

      //       for (let i = 0; i < 6; i++) {
      //         doc.text(row.percents[i] || '', 460 + i * 26.6, y, {
      //           width: 26.6,
      //           align: 'center',
      //         });
      //       }

      //       doc.text(row.summary, 620, y, { width: 120 });

      //       y += 40; // Move to the next row position
      //     });
      //   }
      function addTable() {
        // Set font size for table content
        doc.fontSize(10);

        // Draw the headers
        const headers = [
          { label: 'ลำดับ', width: 40, x: 20, height: 60 },
          { label: 'งานปฏิบัติราชการ', width: 140, x: 60, height: 60 },
          { label: 'หน่วยเข้าของระบบ', width: 100, x: 200, height: 60 },
          { label: '2566', width: 160, x: 300 },
          { label: '2567', width: 160, x: 460 },
          {
            label: 'สรุปการดำเนินงาน\nพ.ศ. 67',
            width: 120,
            x: 620,
            height: 60,
          },
        ];

        const startY = 40;

        headers.forEach((header) => {
          doc.text(header.label, header.x, startY, {
            width: header.width,
            align: 'center',
          });
          doc
            .rect(header.x, startY - 10, header.width, header.height ? header.height : 20)
            .stroke();
        });

        // Draw the quarters and months headers
        const quarters = [
          { label: 'ไตรมาสที่ 1', x: 300 },
          { label: 'ไตรมาสที่ 2', x: 380 },
          { label: 'ไตรมาสที่ 3', x: 460 },
          { label: 'ไตรมาสที่ 4', x: 540 },
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
          doc.text(months[i], 300 + (i % 12) * 26.6, startY + 40, {
            width: 26.6,
            align: 'center',
          });
          doc.rect(300 + (i % 12) * 26.6, startY + 30, 26.6, 20).stroke();
        }

        // Add data rows with matching percentages
        const rows = [
          {
            index: '2.4',
            task: 'งานซื้อพร้อมติดตั้งและพัฒนาปรับเปลี่ยน\nระบบจัดการเอกสารอิเล็กทรอนิกส์\n(วงเงิน 4,280,000.-บาท)',
            unit: 'ศทส.ทหาร',
            percents: ['5%', '10%', '15%', '', '', '70%'],
            summary:
              'เปิดซองประกวดราคา\nเรียบร้อยแล้ว\nบริษัท ไทคิสวิก จำกัด\nวงเงิน 4,280,000.-บาท',
          },
          {
            index: '2.5',
            task: 'งานบำรุงรักษาระบบบริหารงานสารบรรณ\nตามโครงการพัฒนาโครงสร้างพื้นฐาน\nด้านเทคโนโลยีสารสนเทศ ประจำปีงบประมาณ\nพ.ศ. 2567 (วงเงิน 6,500,000.-บาท)',
            unit: 'สน.ทหาร',
            percents: ['5%', '10%', '15%', '', '', '65%'],
            summary: 'อยู่ระหว่างการขออนุมัติ\nจัดซื้อจัดจ้าง',
          },
        ];

        let y = 100;
        rows.forEach((row) => {
          const rowHeight = 80; // Height of each row

          // Draw the cells for each row
          const cols = [
            { content: row.index, width: 40, x: 20 },
            { content: row.task, width: 140, x: 60 },
            { content: row.unit, width: 100, x: 200 },
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
            doc.text(row.percents[i] || '', 300 + i * 26.6, y, {
              width: 26.6,
              align: 'center',
            });
            doc.rect(300 + i * 26.6, y - 10, 26.6, rowHeight).stroke();
          }

          for (let i = 0; i < 6; i++) {
            doc.text(row.percents[i] || '', 460 + i * 26.6, y, {
              width: 26.6,
              align: 'center',
            });
            doc.rect(460 + i * 26.6, y - 10, 26.6, rowHeight).stroke();
          }

          doc.text(row.summary, 630, y, { width: 120 });
          doc.rect(620, y - 10, 120, rowHeight).stroke();

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
