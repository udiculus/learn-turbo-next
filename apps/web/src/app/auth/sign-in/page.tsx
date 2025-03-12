import Link from 'next/link';
import React from 'react';
import FormSignIn from './form-sign-in';

function SignInPage(): React.ReactElement {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 lex lex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold mb-4">Sign In Page</h1>
      <FormSignIn />
      <div className="flex justiy-between text-sm mt-2">
        <p>Don&apos;t have an account?</p>&nbsp;
        <Link className="underline" href="/auth/sign-in">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default SignInPage;
