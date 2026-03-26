import type { APIRoute } from 'astro';
import { createPasswordRecord, createSessionForUser, setSessionCookie } from '../../lib/auth';
import { createUser, findUserByEmail } from '../../lib/db';

export const prerender = false;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  if (name.length < 2) {
    return redirect('/signup?error=Please%20enter%20your%20name');
  }

  if (!email.includes('@')) {
    return redirect('/signup?error=Please%20enter%20a%20valid%20email');
  }

  if (password.length < 8) {
    return redirect('/signup?error=Password%20must%20be%20at%20least%208%20characters');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return redirect('/signup?error=Email%20already%20registered');
  }

  const { hash, salt } = createPasswordRecord(password);
  const user = await createUser({
    name,
    email,
    passwordHash: hash,
    salt,
  });

  const session = await createSessionForUser(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
