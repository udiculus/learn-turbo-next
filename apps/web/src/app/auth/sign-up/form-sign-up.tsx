'use client';

import React, { useActionState } from 'react';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import ButtonSubmit from '@repo/ui/components/form/button-submit';
import { signUp } from '../../lib/auth';

function FormSignUp(): React.ReactElement {
  const [state, action] = useActionState(signUp, undefined);

  return (
    <form action={action}>
      <div className="flex flex-col gap-3">
        {state?.message ? (
          <p className="text-sm text-red-500">{state.message}</p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={state?.payload?.name}
            placeholder="John Doe"
          />
        </div>
        {state?.error?.name ? (
          <p className="text-sm text-red-500">{state.error.name.join('. ')}</p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            defaultValue={state?.payload?.email}
            placeholder="john@example.com"
          />
        </div>
        {state?.error?.email ? (
          <p className="text-sm text-red-500">{state.error.email.join('. ')}</p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        {state?.error?.password ? (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <ButtonSubmit>Sign Up</ButtonSubmit>
      </div>
    </form>
  );
}

export default FormSignUp;
