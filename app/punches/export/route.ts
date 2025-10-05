import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth, adminDb } from "@/lib/firebaseAdmin"
import PDFDocument from "pdfkit"
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session"
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month")
  if(!month) return NextResponse.json({error:"Missing month"}, {status:400})
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({error:"Not authenticated"},{status:401})
  try{
    const decoded = await adminAuth.verifySessionCookie(token, true)
    const uid = decoded.uid
    const [y,m] = month.split("-").map(Number)
    const start = new Date(y, m-1, 1).getTime()
    const end = new Date(y, m, 0, 23,59,59,999).getTime()
    const snap = await adminDb.collection("pontos").where("userId","==",uid).where("timestamp",">=",start).where("timestamp","<=",end).orderBy("timestamp","asc").get()
    const data = snap.docs.map((d:any)=>({ id:d.id, ...(d.data()) }))
    const doc = new PDFDocument({ size:"A4", margin:40 })
    const bufs: Buffer[] = []
    doc.on("data",(d)=>bufs.push(d as Buffer))
    doc.fontSize(18).text(`Relatório de Pontos — ${month}`, {align:"center"}).moveDown()
    doc.fontSize(12)
    doc.text(`Funcionário: ${decoded.email || uid}`)
    doc.text(`Total registros: ${data.length}`)
    doc.moveDown()
    doc.font("Helvetica-Bold").text("Data/Hora", { continued:true, width:240 })
    doc.text("Tipo", { continued:true, width:80, align:"center" })
    doc.text("IP", { continued:true, width:120, align:"center" })
    doc.text("Origem")
    doc.moveDown(0.5)
    doc.font("Helvetica")
    data.forEach((p:any)=>{
      const dt = new Date(p.timestamp).toLocaleString()
      const type = p.type==='in'?'Entrada':'Saída'
      const origin = p.manual?'Manual':'Automático'
      doc.text(dt, { continued:true, width:240 })
      doc.text(type, { continued:true, width:80, align:"center" })
      doc.text(p.ip||"-", { continued:true, width:120, align:"center" })
      doc.text(origin)
    })
    doc.end()
    const pdf: Buffer = await new Promise((res)=>{ doc.on("end", ()=> res(Buffer.concat(bufs))) })
    return new NextResponse(pdf, { status:200, headers:{ "Content-Type":"application/pdf", "Content-Disposition":`inline; filename="pontos-${month}.pdf"` } })
  }catch(e:any){
    return NextResponse.json({error:e?.message||"Failed"},{status:400})
  }
}