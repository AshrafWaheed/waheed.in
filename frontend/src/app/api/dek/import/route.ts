import { bulkCreateGuests } from '../../../../../lib/dek-db';

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return Response.json({ error: 'No file uploaded — use field name "file"' }, { status: 400 });
  }

  const text = await (file as Blob).text();
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  if (lines.length < 1) {
    return Response.json({ error: 'CSV file is empty' }, { status: 400 });
  }

  const headerLine = lines[0].trim().toLowerCase();
  if (headerLine !== 'name,with_family') {
    return Response.json(
      { error: 'Invalid CSV format. Headers must be: name,with_family' },
      { status: 400 }
    );
  }

  const rows: { name: string; withFamily: boolean }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    const name = (parts[0] ?? '').trim();
    const withFamilyRaw = (parts[1] ?? '').trim();

    if (!name) continue;

    rows.push({ name, withFamily: withFamilyRaw === '1' });
  }

  const result = bulkCreateGuests(rows);
  return Response.json(result, { status: 200 });
}
