import { Router } from 'itty-router';

const router = Router();
const uuid = () => crypto.randomUUID();

// const Submission = {
//   commission: String,
//   theme: String,
//   firstName: String,
//   lastName: String,
//   date: { type: Date, default: Date.now },
//   file: binary,
// };

router.get('/submissions', () => {
  const data = [
    {
      _id: '6140c37e75254425bf5cb689',
      commission: '1',
      theme: '1',
      firstName: 'Prueba',
      lastName: 'Probando',
      fileName: 'http://api-bokksu.gzalo.com/uploads/1631634300888.jpg',
      date: '2021-09-14T15:45:02.192Z',
      __v: 0,
    },
  ];

  return new Response(JSON.stringify(data));
});

router.post('/submissions', async (request) => {
  /*if (!req.file) {
    return resp.status(400).send({ error: 'Archivo faltante' });
  }*/
  const data = await request.json();
  if (!data.commission || !data.theme || !data.firstName || !data.lastName) {
    return new Response(JSON.stringify({ error: 'Faltan completar campos' }), { status: 400 });
  }

  const id = uuid();

  const submission = {
    id,
    commission: data.commission,
    theme: data.theme,
    firstName: data.firstName,
    lastName: data.lastName,
    date: Date.now(),
  };

  await DATA.put(id, 'hello', { metadata: submission });
});

router.get('/submissions/:id', async ({ params }) => {
  const data = await DATA.get(params.id);
  return new Response(JSON.stringify(data));
});

addEventListener('fetch', (event) => event.respondWith(router.handle(event.request)));
