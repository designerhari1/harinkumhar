import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type PublicUser = Omit<UserRecord, 'passwordHash' | 'salt'>;

type SessionRecord = {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

export type LeadRecord = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type Database = {
  users: UserRecord[];
  sessions: SessionRecord[];
  leads: LeadRecord[];
};

const EMPTY_DB: Database = {
  users: [],
  sessions: [],
  leads: [],
};

let pendingWrite: Promise<void> = Promise.resolve();

async function ensureDbFile() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), 'utf-8');
  }
}

async function readDb(): Promise<Database> {
  await ensureDbFile();

  try {
    const file = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(file) as Partial<Database>;

    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      leads: parsed.leads ?? [],
    };
  } catch {
    return { ...EMPTY_DB };
  }
}

async function writeDb(db: Database) {
  pendingWrite = pendingWrite.then(async () => {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  });

  await pendingWrite;
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();
  return db.users.find((user) => user.email === normalizedEmail) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
}): Promise<PublicUser> {
  const db = await readDb();

  const user: UserRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    salt: input.salt,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);
  return toPublicUser(user);
}

export async function createSession(userId: string, sessionDays = 14): Promise<{ token: string; expiresAt: string }> {
  const db = await readDb();
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString();
  const token = randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '');

  db.sessions.push({
    token,
    userId,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  await writeDb(db);
  return { token, expiresAt };
}

export async function getUserBySessionToken(token: string): Promise<PublicUser | null> {
  const db = await readDb();
  const now = Date.now();

  const before = db.sessions.length;
  db.sessions = db.sessions.filter((session) => new Date(session.expiresAt).getTime() > now);

  if (db.sessions.length !== before) {
    await writeDb(db);
  }

  const activeSession = db.sessions.find((session) => session.token === token);
  if (!activeSession) {
    return null;
  }

  const user = db.users.find((item) => item.id === activeSession.userId);
  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

export async function deleteSession(token: string) {
  const db = await readDb();
  const nextSessions = db.sessions.filter((session) => session.token !== token);

  if (nextSessions.length !== db.sessions.length) {
    db.sessions = nextSessions;
    await writeDb(db);
  }
}

export async function createLead(input: {
  userId: string | null;
  name: string;
  email: string;
  message: string;
}): Promise<LeadRecord> {
  const db = await readDb();

  const lead: LeadRecord = {
    id: randomUUID(),
    userId: input.userId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  db.leads.push(lead);
  await writeDb(db);

  return lead;
}

export async function listLeadsForUser(userId: string): Promise<LeadRecord[]> {
  const db = await readDb();

  return db.leads
    .filter((lead) => lead.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
