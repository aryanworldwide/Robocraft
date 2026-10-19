import { downloadFile } from '@/lib/platform';

export async function exportToPNG(element, filename, scale = 2) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale,
    useCORS: true,
    logging: false,
  });
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (blob) await downloadFile(blob, `${filename}.png`, 'image/png');
}

export async function exportToPDF(element, filename) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  }
  await downloadFile(pdf.output('blob'), `${filename}.pdf`, 'application/pdf');
}
