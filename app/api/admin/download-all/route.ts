import { loadStore } from '@/lib/store';
import { assertAdmin } from '@/lib/auth';
import { finalFilename } from '@/lib/validation';
import AdmZip from 'adm-zip';
export const runtime='nodejs';
export async function GET(req:Request){try{assertAdmin(req); const u=new URL(req.url); const batchId=u.searchParams.get('batchId'); const store=await loadStore(); const zip=new AdmZip(); const rows=store.passports.filter(p=>!batchId||p.batchId===batchId); for(const p of rows){const res=await fetch(p.imageUrl); const buf=Buffer.from(await res.arrayBuffer()); const ext=(p.originalFilename.match(/\.[^.]+$/)?.[0]||'.JPG').toUpperCase(); const name=(p.name&&p.stateCode&&p.fileNumber&&p.phone)?finalFilename(p.name,p.stateCode,p.fileNumber,p.phone,ext):`UNASSIGNED/${p.originalFilename}`; zip.addFile(name,buf);} const out=zip.toBuffer(); return new Response(out,{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="passports-bulk.zip"'}});}catch(e:any){return e instanceof Response?e:new Response(e.message,{status:400})}}
