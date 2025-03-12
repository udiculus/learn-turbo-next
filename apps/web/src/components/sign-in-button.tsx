import Link from 'next/link';
import React from 'react';
import { getSession } from '../app/lib/session';

async function SignInButton(): Promise<React.ReactElement> {
  const session = await getSession();

  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session?.user ? (
        <>
          <Link href="/auth/sign-in">Sign In</Link>
          <Link href="/auth/sign-up">Sign Up</Link>
        </>
      ) : (
        <>
          <p>{session.user.name}</p>
          <a href="/api/auth/sign-out">Sign Out</a>
        </>
      )}
    </div>
  );
}

export default SignInButton;
