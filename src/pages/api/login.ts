import type { APIRoute } from 'astro';
import { createSessionForUser, loginWithEmailPassword, setSessionCookie } from '../../lib/auth';

export const prerender = false;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  if (!email || !password) {
    return redirect('/login?error=Enter%20email%20and%20password');
  }

  const user = await loginWithEmailPassword(email, password);
  if (!user) {
    return redirect('/login?error=Invalid%20credentials');
  }

  const session = await createSessionForUser(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
