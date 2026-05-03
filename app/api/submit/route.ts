import { NextResponse } from 'next/server';
import { loadStore, saveStore, defaultSettings } from '@/lib/store';
import { clientIp } from '@/lib/auth';
import {
  validName,
  validStateCode,
  validFileNumber,
  validPhone,
  cleanName,
} from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip = clientIp(req);

    const store = await loadStore();

    const p = store.passports.find((x: any) => x.id === body.passportId);

    if (!p) {
      throw new Error('Passport not found');
    }

    const settings = store.settings[p.batchId] || defaultSettings();

    const now = Date.now();
    const windowMs = settings.cooldownMinutes * 60 * 1000;

    const logs = store.logs.filter(
      (l: any) => l.ip === ip && now - l.time < windowMs
    );

    if (logs.length >= settings.maxEditsPerIp) {
      return NextResponse.json(
        {
          error: `Edit limit reached. Try again after ${settings.cooldownMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    if (p.isRaw && !settings.allowRawPhotoClaim) {
      throw new Error('Raw photo claiming is disabled');
    }

    if (p.status === 'pending_review') {
      throw new Error(
        'This passport already has a pending correction awaiting admin review'
      );
    }

    if (!validName(body.name)) {
      throw new Error(
        'Invalid name. Use letters, spaces, hyphen or apostrophe only.'
      );
    }

    if (!validStateCode(body.stateCode)) {
      throw new Error('Invalid State Code format. Example: KG2026A');
    }

    if (!validFileNumber(body.fileNumber)) {
      throw new Error('Invalid file number. Use numbers only.');
    }

    if (!validPhone(body.phone)) {
      throw new Error('Invalid Nigerian phone number.');
    }

    p.name = cleanName(body.name);
    p.stateCode = body.stateCode.toUpperCase();
    p.fileNumber = String(body.fileNumber);
    p.phone = body.phone;
    p.status = settings.requireAdminApproval ? 'pending_review' : 'approved';
    p.updatedAt = new Date().toISOString();
    p.isRaw = false;

    store.logs.push({
      ip,
      passportId: p.id,
      time: now,
    });

    await saveStore(store);

    return NextResponse.json({
      ok: true,
      message: settings.requireAdminApproval
        ? 'Submitted for admin review'
        : 'Details updated',
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Submission failed' },
      { status: 400 }
    );
  }
}