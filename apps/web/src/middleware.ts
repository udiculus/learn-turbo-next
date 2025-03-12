import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';
import { generateRefreshToken } from './app/lib/auth';

export default async function middleware(
  req: NextRequest
): Promise<NextResponse | undefined> {
  const session = await getSession();
  if (!session)
    return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl));

  // if session is expired then refresh the token
  const payload = JSON.parse(atob(session.accessToken.split('.')[1])) as {
    exp?: number;
  };
  if (payload.exp && payload.exp * 1000 < Date.now() && session.refreshToken) {
    console.log('session expired');
    const newSession = await generateRefreshToken(session.refreshToken);
    if (newSession) {
      const res = NextResponse.next();
      const expiredAt = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 7 // 7 days. should be managed variable
      );
      res.cookies.set('session', newSession, {
        expires: expiredAt,
        httpOnly: true,
        path: '/',
      });
      return res;
    }
    return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl));
  }
  if (payload.exp) {
    console.log('session date', {
      now: Date.now(),
      expires: payload.exp * 1000,
      state: payload.exp * 1000 < Date.now(),
      payload,
    });
  }

  NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};
