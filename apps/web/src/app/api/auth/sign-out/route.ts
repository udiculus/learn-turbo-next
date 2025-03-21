import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { authFetch } from '@/lib/auth-fetch';
import { BACKEND_URL } from '@/lib/constants';
import { deleteSession } from '@/lib/session';

export async function GET(req: NextRequest): Promise<NextResponse> {
  await authFetch(`${BACKEND_URL}/auth/sign-out`, {
    method: 'POST',
  });
  await deleteSession();

  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  return NextResponse.redirect(new URL('/', req.nextUrl));
}
