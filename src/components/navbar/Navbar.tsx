"use client";
import Link from "next/link";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";
export default function MainNav() {
  return (
    <nav className="px-2 sm:px-4 py-2.5 rounded border-b dark:border-zinc-700 sticky top-0 bg-neutral-950">
      <div className="flex flex-wrap justify-between items-center mx-auto">
        <SidebarTrigger />
        <Link href="/dashboard" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Stato-gram
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* <OrganizationSwitcher /> */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
