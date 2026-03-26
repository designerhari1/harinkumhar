import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { createSession, deleteSession, findUserByEmail, getUserBySessionToken, type PublicUser } from './db';

export const SESSION_COOKIE_NAME = 'ec_session';
const SESSION_DAYS = 14;

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

export function createPasswordRecord(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  return { hash, salt };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const candidateHash = hashPassword(password, salt);
  const a = Buffer.from(candidateHash, 'hex');
  const b = Buffer.from(storedHash, 'hex');

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export async function loginWithEmailPassword(email: string, password: string): Promise<PublicUser | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function createSessionForUser(userId: string): Promise<{ token: string; expiresAt: string }> {
  return createSession(userId, SESSION_DAYS);
}

export function setSessionCookie(cookies: AstroCookies, token: string, expiresAt: string) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export async function destroySessionByToken(token: string | undefined) {
  if (!token) {
    return;
  }

  await deleteSession(token);
}

export async function getUserFromCookies(cookies: AstroCookies): Promise<PublicUser | null> {
  const sessionToken = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }

  return getUserBySessionToken(sessionToken);
}
