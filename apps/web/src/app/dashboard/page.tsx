import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '../lib/session';

async function Dashboard(): Promise<React.ReactElement> {
  const session = await getSession();
  if (!session) redirect('/auth/sign-in');

  console.log('Session', session);

  return <div>Dashboard</div>;
}

export default Dashboard;
