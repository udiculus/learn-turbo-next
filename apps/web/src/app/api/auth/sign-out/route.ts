import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteSession } from '../../../lib/session';

export async function GET(req: NextRequest): Promise<NextResponse> {
  await deleteSession();

  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  return NextResponse.redirect(new URL('/', req.nextUrl));
}
