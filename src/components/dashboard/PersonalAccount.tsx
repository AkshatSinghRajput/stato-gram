import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-3xl border bg-gradient-to-b from-zinc-900 to-black text-white border-zinc-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to your personal account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Access to the dashboard requires organization membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-300 mb-4">
            Please switch to an organization from sidebar to access the
            dashboard. If you are an organization owner, you can create a new
            organization.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white border-0"
          >
            <Link href="/dashboard/create-organization">
              Create Organization
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
