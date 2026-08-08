"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button className="sign-out" type="button" onClick={() => signOut({ redirectTo: "/login" })}>Sign out</button>;
}
