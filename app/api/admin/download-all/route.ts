import { loadStore } from '@/lib/store';
import { assertAdmin } from '@/lib/auth';
import { finalFilename } from '@/lib/validation';
import AdmZip from 'adm-zip';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    assertAdmin(req);

    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');

    const store = await loadStore();
    const zip = new AdmZip();

    const rows = store.passports.filter((p: any) => !batchId || p.batchId === batchId);

    for (const p of rows) {
      const res = await fetch(p.imageUrl);

      if (!res.ok) {
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());

      const ext =
        p.originalFilename?.match(/\.[^.]+$/)?.[0]?.toUpperCase() || '.JPG';

      const filename =
        p.name && p.stateCode && p.fileNumber && p.phone
          ? finalFilename({
              name: p.name,
              stateCode: p.stateCode,
              fileNumber: p.fileNumber,
              phone: p.phone,
              ext,
            })
          : `UNASSIGNED/${p.originalFilename || `${p.id}${ext}`}`;

      zip.addFile(filename, buffer);
    }

    const output = zip.toBuffer();

    return new Response(output, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="passports-bulk.zip"',
      },
    });
  } catch (e: any) {
    return e instanceof Response
      ? e
      : new Response(e.message || 'Download failed', { status: 400 });
  }
}