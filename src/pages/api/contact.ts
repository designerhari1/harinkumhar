import type { APIRoute } from 'astro';
import { getUserFromCookies } from '../../lib/auth';
import { createLead } from '../../lib/db';

export const prerender = false;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const source = String(form.get('source') ?? 'landing');
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const message = String(form.get('message') ?? '').trim();

  const user = await getUserFromCookies(cookies);

  const finalName = name || user?.name || '';
  const finalEmail = email || user?.email || '';

  if (finalName.length < 2 || !finalEmail.includes('@') || message.length < 8) {
    return redirect(source === 'dashboard' ? '/dashboard' : '/');
  }

  await createLead({
    userId: user?.id ?? null,
    name: finalName,
    email: finalEmail,
    message,
  });

  return redirect(source === 'dashboard' ? '/dashboard?saved=1' : '/?sent=1');
};
