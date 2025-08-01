import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportInsightsToPDF(insights: any[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('SaintSal Insight Report', 14, 22);

  autoTable(doc, {
    head: [['Title', 'Summary', 'Tags']],
    body: insights.map((i) => [i.title, i.summary, i.tags.join(', ')]),
    startY: 30,
  });

  doc.save('saintsal-insight-report.pdf');
}
