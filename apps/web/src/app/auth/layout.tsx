import React, { type PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren): React.ReactElement {
  return (
    <div className="bg-gradient-to-br from-cyan-800 to-cyan-950 h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
