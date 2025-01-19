import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth();
  console.log("user Details", user);

  redirect("/dashboard");
  return null;
}
