import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteSession } from '../../../lib/session';
import { authFetch } from '../../../lib/auth-fetch';
import { BACKEND_URL } from '../../../lib/constants';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const response = await authFetch(`${BACKEND_URL}/auth/sign-out`, {
    method: 'POST',
  });
  if (response.ok) {
    await deleteSession();
  }

  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  return NextResponse.redirect(new URL('/', req.nextUrl));
}
