import { NextResponse } from 'next/server';
import { loadStore, saveStore } from '@/lib/store';
import { assertAdmin } from '@/lib/auth';
export async function POST(req:Request){try{assertAdmin(req); const {id}=await req.json(); const store=await loadStore(); const p=store.passports.find(x=>x.id===id); if(!p) throw new Error('Not found'); p.status='approved'; await saveStore(store); return NextResponse.json({ok:true});}catch(e:any){return e instanceof Response?e:NextResponse.json({error:e.message},{status:400})}}
