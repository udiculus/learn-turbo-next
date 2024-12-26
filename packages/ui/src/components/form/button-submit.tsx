"use client";

import React, { type PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

function ButtonSubmit({ children }: PropsWithChildren): React.ReactElement {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} className="w-full mt-2">
      {pending ? "Submitting..." : children}
    </Button>
  );
}

export default ButtonSubmit;
