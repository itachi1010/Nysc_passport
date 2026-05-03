import { NextResponse } from 'next/server';
import { loadStore, saveStore, uid, defaultSettings } from '@/lib/store';
import { assertAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const store = await loadStore();
  const isAdmin = new URL(req.url).searchParams.get('adminKey');
  return NextResponse.json(isAdmin ? store : { batches: store.batches });
}

export async function POST(req: Request) {
  try {
    assertAdmin(req);

    const body = await req.json();
    const store = await loadStore();

    const batch = {
      id: uid(),
      year: body.year,
      batchName: body.batchName,
      stream: body.stream,
      platoon: body.platoon,
      description: body.description,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
    };

    store.batches.push(batch);
    store.settings[batch.id] = defaultSettings();

    await saveStore(store);

    return NextResponse.json({ ok: true, batch });
  } catch (e: any) {
    return e instanceof Response
      ? e
      : NextResponse.json({ error: e.message }, { status: 400 });
  }
}