import { getSession } from './session';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
): Promise<Response> => {
  const session = await getSession();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken ?? ''}`,
  };

  const response = await fetch(url, options);

  console.log('response status', response.status);
  // if (response.status === 401) {
  //   if (!session?.refreshToken) throw new Error('Refresh token not found');
  //   const newAccessToken = await generateRefreshToken(session.refreshToken);

  //   if (newAccessToken) {
  //     options.headers.Authorization = `Bearer ${newAccessToken}`;
  //     return await fetch(url, options);
  //   }
  // }

  return response;
};

