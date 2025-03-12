'use server';

import { authFetch } from './auth-fetch';
import { BACKEND_URL } from './constants';
import { getSession } from './session';

export const getProfile = async (): Promise<string> => {
  const session = await getSession();
  console.log('action session', session);
  const response = await authFetch(`${BACKEND_URL}/auth/restricted`);
  const result = (await response.json()) as string;
  return result;
};

