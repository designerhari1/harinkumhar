import type { APIRoute } from 'astro';
import { clearSessionCookie, destroySessionByToken, SESSION_COOKIE_NAME } from '../../lib/auth';

export const prerender = false;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  await destroySessionByToken(token);
  clearSessionCookie(cookies);

  return redirect('/');
};
