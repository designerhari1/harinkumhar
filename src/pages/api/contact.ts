import type { APIRoute } from 'astro';
import { createLead } from '../../lib/db';

export const prerender = false;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const message = String(form.get('message') ?? '').trim();

  if (name.length < 2 || !email.includes('@') || message.length < 8) {
    return redirect('/');
  }

  await createLead({
    userId: null,
    name,
    email,
    message,
  });

  return redirect('/?sent=1');
};
