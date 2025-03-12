import React from 'react';
import { getProfile } from '../lib/actions';

async function Profile(): Promise<React.ReactElement> {
  const res = await getProfile();
  return (
    <>
      <div>Profile</div>
      <div>{JSON.stringify(res)}</div>
    </>
  );
}

export default Profile;
