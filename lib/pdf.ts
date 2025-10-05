import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type Punch = { id: string; userId: string; timestamp: number; dateKey: string; type: 'in'|'out'; manual: boolean; ip: string }

export async function buildMonthPdf(title: string, punches: Punch[]) {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  let x = 50
  let y = 780
  page.drawText(title, { x, y, size: 16, font, color: rgb(0, 0, 0) })
  y -= 24
  page.drawText('Date        Time              Type   Manual   IP', { x, y, size: 11, font })
  y -= 16
  punches
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(p => {
      if (y < 60) {
        const newPage = pdf.addPage([595.28, 841.89])
        y = 780
        newPage.drawText(title, { x, y, size: 16, font })
        y -= 24
        newPage.drawText('Date        Time              Type   Manual   IP', { x, y, size: 11, font })
        y -= 16
      }
      const d = new Date(p.timestamp)
      const date = d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
      const time = d.toLocaleTimeString('pt-BR', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const line = `${date.padEnd(11)} ${time.padEnd(18)} ${p.type.padEnd(6)} ${String(p.manual).padEnd(7)} ${p.ip}`
      const pageRef = pdf.getPage(pdf.getPageCount() - 1)
      pageRef.drawText(line, { x, y, size: 10, font })
      y -= 14
    })
  return await pdf.save()
}
