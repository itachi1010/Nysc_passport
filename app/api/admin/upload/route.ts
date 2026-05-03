import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { put } from '@vercel/blob';
import { parsePassportFilename } from '@/lib/parser';
import { loadStore, saveStore, uid } from '@/lib/store';
import { assertAdmin } from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){try{assertAdmin(req); const fd=await req.formData(); const file=fd.get('zip') as File; const batchId=String(fd.get('batchId')||''); if(!file||!batchId) throw new Error('ZIP file and batchId are required'); const buf=Buffer.from(await file.arrayBuffer()); const zip=new AdmZip(buf); const store=await loadStore(); let parsed=0,raw=0; for(const entry of zip.getEntries()){ if(entry.isDirectory) continue; if(!/\.(jpe?g|png)$/i.test(entry.entryName)) continue; const originalFilename=entry.entryName.split('/').pop()!; const info:any=parsePassportFilename(originalFilename); const blob=await put(`passports/${batchId}/${Date.now()}-${originalFilename}`, entry.getData(), {access:'public',allowOverwrite:true}); store.passports.push({id:uid('pass'),batchId,name:info.name||'',stateCode:info.stateCode||'',fileNumber:info.fileNumber||'',phone:info.phone||'',originalFilename,imageUrl:blob.url,status:info.raw?'unassigned':'parsed',isRaw:!!info.raw,createdAt:new Date().toISOString()}); info.raw?raw++:parsed++; } await saveStore(store); return NextResponse.json({ok:true,parsed,raw,total:parsed+raw});}catch(e:any){return e instanceof Response?e:NextResponse.json({error:e.message},{status:400})}}
