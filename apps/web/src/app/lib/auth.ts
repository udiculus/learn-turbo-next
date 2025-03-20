'use server';

import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constants';
import {
  SignUpFormSchema,
  type RegisterPayload,
  type FormState,
  type LoginPayload,
  type Role,
  LoginFormSchema,
} from './type';
import { createSession, updateToken } from './session';

export async function signUp(
  state: FormState<RegisterPayload>,
  formData: FormData
): Promise<FormState<RegisterPayload>> {
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

export async function signIn(
  state: FormState<LoginPayload>,
  formData: FormData
): Promise<FormState<LoginPayload>> {
  const validationFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
      // todo: need to revisit how to populate form data
      payload: {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    const result = (await response.json()) as {
      id: string;
      name: string;
      role: Role;
      accessToken: string;
      refreshToken: string;
    };

    await createSession({
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect('/');
  } else {
    return {
      message:
        response.status === 401 ? 'Invalid credentials!' : response.statusText,
      // todo: need to revisit how to populate form data
      payload: validationFields.data,
    };
  }
}

export const generateRefreshToken = async (
  oldRefreshToken: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token ${response.statusText}`);
    }

    const { accessToken, refreshToken } = (await response.json()) as {
      id: string;
      name: string;
      accessToken: string;
      refreshToken: string;
    };

    return await updateToken({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to refresh token`);
  }
};
