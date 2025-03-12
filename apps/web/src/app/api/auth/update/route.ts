import { type NextRequest } from 'next/server';
import { updateToken } from '../../../lib/session';

export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  const { accessToken, refreshToken } = body;

  const cookie = req.cookies.get('session');
  console.log('cookies stored', cookie);

  if (!accessToken || !refreshToken) {
    return new Response('Provide Tokens', { status: 401 });
  }

  await updateToken({ accessToken, refreshToken });

  console.log('Tokens', { accessToken, refreshToken });
  return new Response('Tokens updated', { status: 200 });
}

