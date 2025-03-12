'use server';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Session = {
  user: {
    id: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
  exp?: number;
};

const secretKey = process.env.SESSION_SECRET_KEY ?? '';
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session): Promise<string> {
  const expiredAt = new Date(
    new Date().getTime() + 1000 * 60 * 60 * 24 * 7 // 7 days
  );

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  console.log('new session created', session);

  (await cookies()).set('session', session, {
    expires: expiredAt,
    httpOnly: true,
    path: '/',
  });

  return session;
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload as Session;
  } catch (error) {
    console.error('Failed to verify session cookie:', error);
    redirect('/auth/sign-in');
  }
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete('session');
}

export async function updateToken({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}): Promise<string | undefined> {
  const cookie = (await cookies()).get('session');
  if (!cookie) {
    console.log('cookie not found', cookie);
    return;
  }
  console.log('cookie found', cookie);

  const { payload } = await jwtVerify<Session>(cookie.value, encodedKey);

  if (!payload.accessToken) throw new Error('Session not found');

  const newPayload: Session = {
    user: { ...payload.user },
    accessToken,
    refreshToken,
  };

  console.log('updateToken', JSON.stringify(newPayload));

  return await createSession(newPayload);
}
