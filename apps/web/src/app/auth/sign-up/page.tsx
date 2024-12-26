import Link from "next/link";
import React from "react";
import FormSignUp from "./form-sign-up";

function SignUpPage(): React.ReactElement {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 lex lex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold mb-4">Sign In Page</h1>
      <FormSignUp />
      <div className="flex justiy-between text-sm mt-2">
        <p>Already have an account?</p>&nbsp;
        <Link className="underline" href="/auth/sign-in">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default SignUpPage;
