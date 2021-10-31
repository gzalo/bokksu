import { Router } from 'itty-router';
import { parseRequest } from './parseRequest';

const router = Router();
const uuid = () => crypto.randomUUID();

const headers = {
  'Access-Control-Allow-Origin': '*',
};

type Submission = {
  _id: string;
  commission: string;
  theme: string;
  firstName: string;
  lastName: string;
  date: string;
  contentType: string;
};

router.get('/submissions', async () => {
  const keys = await DATA.list<Submission>();
  const out: (Submission | undefined)[] = keys.keys.map((key: KVNamespaceListKey<Submission>) => key.metadata);

  return new Response(JSON.stringify(out), { headers });
});

router.options('/submissions', () => new Response('', { headers }));

router.post('/submissions', async (request: Request) => {
  const fd = await parseRequest(request);

  if (!fd?.fileNames.includes('file')) {
    return new Response(JSON.stringify({ error: 'Missing file' }), { status: 400, headers });
  }

  const data = JSON.parse(fd?.others[0]);
  if (!data.commission || !data.theme || !data.firstName || !data.lastName) {
    return new Response(JSON.stringify({ error: 'Faltan completar campos' }), { status: 400, headers });
  }

  const id = uuid();

  const submission: Submission = {
    _id: id,
    commission: data.commission.toString(),
    theme: data.theme.toString(),
    firstName: data.firstName.toString(),
    lastName: data.lastName.toString(),
    date: new Date().toISOString(),
    contentType: fd.fileTypes[0],
  };

  const fileData = await fd.files[0].arrayBuffer();
  await DATA.put(id, fileData, { metadata: submission });
  return new Response(JSON.stringify({ _id: id }), { headers });
});

router.get('/submissions/:id', async ({ params, url }) => {
  const id = params?.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400, headers });
  }
  const data = await DATA.getWithMetadata<Submission>(id);
  if (!data.value || !data.metadata) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers });
  }
  const updatedData = { ...data.metadata, fileName: url + '/image' };
  return new Response(JSON.stringify(updatedData), { headers });
});

router.get('/submissions/:id/image', async ({ params }) => {
  const id = params?.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400, headers });
  }
  const data = await DATA.getWithMetadata<Submission>(id, { type: 'arrayBuffer' });
  if (!data.value || !data.metadata) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers });
  }
  const contentType = data.metadata.contentType;
  return new Response(data.value, { headers: { 'Content-Type': contentType, ...headers } });
});

addEventListener('fetch', (event) => event.respondWith(router.handle(event.request)));
