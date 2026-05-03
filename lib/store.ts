import { put, head } from '@vercel/blob';
import { Store, Settings } from './types';
const STORE_KEY='data-store.json';
const defaultStore:Store={batches:[],passports:[],settings:{},editLogs:[]};
export async function loadStore():Promise<Store>{
  try{ const h=await head(STORE_KEY); const r=await fetch(h.url,{cache:'no-store'}); return await r.json(); }catch{return defaultStore;}
}
export async function saveStore(store:Store){ await put(STORE_KEY, JSON.stringify(store,null,2), {access:'public',contentType:'application/json',allowOverwrite:true}); }
export function defaultSettings():Settings{return {maxEditsPerIp:3,cooldownMinutes:30,allowRawPhotoClaim:true,requireAdminApproval:true}}
export function uid(prefix='id'){return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,9)}`}
