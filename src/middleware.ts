import { defineMiddleware } from 'astro:middleware';
import { getUserFromCookies } from './lib/auth';

const protectedPrefixes = ['/dashboard'];
const authPages = new Set(['/login', '/signup']);

export const onRequest = defineMiddleware(async (context, next) => {
  const user = await getUserFromCookies(context.cookies);
  context.locals.user = user;

  const pathname = context.url.pathname;
  const requiresAuth = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (requiresAuth && !user) {
    return context.redirect('/login');
  }

  if (authPages.has(pathname) && user) {
    return context.redirect('/dashboard');
  }

  return next();
});
