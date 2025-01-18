import { checkDatabase } from "@/server/actions/authentication/singin.actions";

export default async function Home() {
  const isConnected = await checkDatabase();

  if (!isConnected) {
    return (
      <div className="grid place-items-center h-screen">
        <h1 className="text-2xl font-semibold">Database connection failed!</h1>
      </div>
    );
  }
  return (
    <div className="grid place-items-center h-screen">
      <h1 className="text-2xl font-semibold">
        Database connection successful!
      </h1>
    </div>
  );
}
