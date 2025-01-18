"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInComponent() {
  return (
    <div className="grid place-items-center h-screen">
      <SignIn />
    </div>
  );
}
