'use server';

import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constants';
import { SignUpFormSchema, type UserPayload, type FormState } from './type';

export async function signUp(
  state: FormState<UserPayload>,
  formData: FormData
): Promise<FormState<UserPayload>> {
  const validationFields = SignUpFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
      // todo: need to revisit how to populate form data
      payload: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    redirect('/auth/sign-in');
  } else {
    return {
      message:
        response.status === 409
          ? 'The user is already registered'
          : response.statusText,
      // todo: need to revisit how to populate form data
      payload: validationFields.data,
    };
  }
}
